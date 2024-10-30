;; Token Swap Contract

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-invalid-token (err u101))
(define-constant err-insufficient-balance (err u102))
(define-constant err-invalid-amount (err u103))
(define-constant err-same-token (err u104))
(define-constant err-not-whitelisted (err u105))

;; Data Variables
(define-data-var minimum-amount uint u1000) ;; Minimum swap amount (in smallest unit)
(define-data-var swap-fee-rate uint u30) ;; 0.3% fee rate (basis points)
(define-data-var protocol-fee-rate uint u10) ;; 0.1% protocol fee (basis points)

;; Data Maps
(define-map token-pairs 
    { token-x: principal, token-y: principal }
    { pool-address: principal, 
      liquidity: uint,
      last-price-x: uint,
      last-price-y: uint,
      volume-24h: uint,
      fees-collected: uint })

(define-map whitelisted-tokens principal bool)
(define-map token-balances { token: principal, owner: principal } uint)
(define-map price-oracle principal uint)

;; Read-only functions
(define-read-only (get-token-pair (token-x principal) (token-y principal))
    (map-get? token-pairs { token-x: token-x, token-y: token-y }))

(define-read-only (get-token-balance (token principal) (owner principal))
    (default-to u0 
        (map-get? token-balances { token: token, owner: owner })))

(define-read-only (get-price (token principal))
    (map-get? price-oracle token))

(define-read-only (calculate-swap-amount (amount-in uint) (token-x principal) (token-y principal))
    (let ((pair (unwrap! (get-token-pair token-x token-y) err-invalid-token))
          (price-x (unwrap! (get-price token-x) err-invalid-token))
          (price-y (unwrap! (get-price token-y) err-invalid-token)))
        (ok {
            amount-out: (/ (* amount-in price-x) price-y),
            fee: (/ (* amount-in (var-get swap-fee-rate)) u10000),
            protocol-fee: (/ (* amount-in (var-get protocol-fee-rate)) u10000)
        })))

;; Public functions
(define-public (whitelist-token (token principal))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (ok (map-set whitelisted-tokens token true))))

(define-public (create-pair (token-x principal) (token-y principal) (initial-liquidity uint))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (asserts! (not (is-eq token-x token-y)) err-same-token)
        (asserts! (map-get? whitelisted-tokens token-x) err-not-whitelisted)
        (asserts! (map-get? whitelisted-tokens token-y) err-not-whitelisted)
        (ok (map-set token-pairs 
            { token-x: token-x, token-y: token-y }
            { pool-address: (as-contract tx-sender),
              liquidity: initial-liquidity,
              last-price-x: u0,
              last-price-y: u0,
              volume-24h: u0,
              fees-collected: u0 }))))

(define-public (swap (amount-in uint) (token-x principal) (token-y principal))
    (let ((sender tx-sender)
          (pair (unwrap! (get-token-pair token-x token-y) err-invalid-token))
          (sender-balance (get-token-balance token-x sender))
          (swap-result (unwrap! (calculate-swap-amount amount-in token-x token-y) err-invalid-token)))
        (begin
            ;; Validate the swap
            (asserts! (>= amount-in (var-get minimum-amount)) err-invalid-amount)
            (asserts! (>= sender-balance amount-in) err-insufficient-balance)
            (asserts! (not (is-eq token-x token-y)) err-same-token)
            
            ;; Update balances
            (map-set token-balances 
                { token: token-x, owner: sender }
                (- sender-balance amount-in))
            
            (map-set token-balances 
                { token: token-y, owner: sender }
                (+ (get-token-balance token-y sender) 
                   (get amount-out swap-result)))
            
            ;; Update pair data
            (map-set token-pairs
                { token-x: token-x, token-y: token-y }
                (merge pair {
                    volume-24h: (+ (get volume-24h pair) amount-in),
                    fees-collected: (+ (get fees-collected pair) 
                                     (+ (get fee swap-result) 
                                        (get protocol-fee swap-result)))
                }))
            
            (ok swap-result))))

;; Admin functions
(define-public (update-fee-rates (new-swap-fee uint) (new-protocol-fee uint))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (var-set swap-fee-rate new-swap-fee)
        (var-set protocol-fee-rate new-protocol-fee)
        (ok true)))

(define-public (update-minimum-amount (new-minimum uint))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (var-set minimum-amount new-minimum)
        (ok true)))

(define-public (update-price (token principal) (new-price uint))
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (ok (map-set price-oracle token new-price))))