(use-trait ft-trait .sip-010-trait-ft-standard.sip-010-trait)
(use-trait nft-trait .nft-trait.nft-trait)
;; ... rest of your contract code ...
;; Define listing errors
(define-constant ERR_EXPIRY_IN_PAST (err u1000))
(define-constant ERR_PRICE_ZERO (err u1001))

;; Define cancelling and fulfilling errors
(define-constant ERR_UNKNOWN_LISTING (err u2000))
(define-constant ERR_UNAUTHORISED (err u2001))
(define-constant ERR_LISTING_EXPIRED (err u2002))
(define-constant ERR_NFT_ASSET_MISMATCH (err u2003))
(define-constant ERR_PAYMENT_ASSET_MISMATCH (err u2004))
(define-constant ERR_MAKER_TAKER_EQUAL (err u2005))
(define-constant ERR_UNINTENDED_TAKER (err u2006))
(define-constant ERR_ASSET_CONTRACT_NOT_WHITELISTED (err u2007))
(define-constant ERR_PAYMENT_CONTRACT_NOT_WHITELISTED (err u2008))
(define-constant ERR_PAYMENT_CONTRACT_MISMATCH (err u101)) ;; Define the missing error constant

;; Define contract owner
(define-constant contract-owner tx-sender)

;; Define error constants
(define-constant ERR_ASSET_CONTRACT_MISMATCH (err u1002))
(define-constant ERR_INVALID_TOKEN_ID (err u1003))
(define-constant ERR_INVALID_PRICE (err u1004))

;; Define a map data structure for the asset listings
(define-map listings
  uint
  {
    maker: principal,
    taker: (optional principal),
    token-id: uint,
    nft-asset-contract: principal,
    expiry: uint,
    price: uint,
    payment-asset-contract: (optional principal)
  }
)

;; Used for unique IDs for each listing
(define-data-var listing-nonce uint u0)

(define-public (list-asset
  (nft-asset-contract <nft-trait>)
  (nft-asset {
    taker: (optional principal),
    token-id: uint,
    expiry: uint,
    price: uint,
    payment-asset-contract: (optional principal)
  })
)
  (let ((listing-id (var-get listing-nonce)))
    ;; Verify that the contract of this asset is whitelisted
    (asserts! (is-whitelisted (contract-of nft-asset-contract)) ERR_ASSET_CONTRACT_NOT_WHITELISTED)
    ;; Verify that the asset is not expired
    (asserts! (> (get expiry nft-asset) block-height) ERR_EXPIRY_IN_PAST)
    ;; Verify that the asset price is greater than zero
    (asserts! (> (get price nft-asset) u0) ERR_PRICE_ZERO)
    ;; Verify that the contract of the payment is whitelisted
    (asserts! (match (get payment-asset-contract nft-asset)
      payment-asset
      (is-whitelisted payment-asset)
      true
    ) ERR_PAYMENT_CONTRACT_NOT_WHITELISTED)
    ;; Transfer the NFT ownership to this contract's principal
    (try! (transfer-nft
      nft-asset-contract
      (get token-id nft-asset)
      tx-sender
      (as-contract tx-sender)
    ))
    ;; List the NFT in the listings map
    (map-set listings listing-id (merge
      { maker: tx-sender, nft-asset-contract: (contract-of nft-asset-contract) }
      nft-asset
    ))
    ;; Increment the nonce to use for the next unique listing ID
    (var-set listing-nonce (+ listing-id u1))
    ;; Return the created listing ID
    (ok listing-id)
  )
)

(define-private (transfer-nft (nft-contract <nft-trait>) (token-id uint) (sender principal) (recipient principal))
  (contract-call? nft-contract transfer token-id sender recipient))

;; ... rest of your contract code ...

(define-read-only (get-listing (listing-id uint))
  (map-get? listings listing-id)
)

(define-public (cancel-listing (listing-id uint) (nft-asset-contract <nft-trait>))
  (let (
    (listing (unwrap! (map-get? listings listing-id) ERR_UNKNOWN_LISTING))
    (maker (get maker listing))
  )
    ;; Verify that the caller of the function is the creator of the NFT to be cancelled
    (asserts! (is-eq maker tx-sender) ERR_UNAUTHORISED)
    ;; Verify that the asset contract to use is the same one that the NFT uses
    (asserts! (is-eq
      (get nft-asset-contract listing)
      (contract-of nft-asset-contract)
    ) ERR_NFT_ASSET_MISMATCH)
    ;; Delete the listing
    (map-delete listings listing-id)
    ;; Transfer the NFT from this contract's principal back to the creator's principal
    (as-contract (transfer-nft nft-asset-contract (get token-id listing) tx-sender maker))
  )
)

(define-map whitelisted-asset-contracts principal bool)

(define-read-only (is-whitelisted (asset-contract principal))
  (default-to false (map-get? whitelisted-asset-contracts asset-contract))
)

;; Define error code for invalid contract
(define-constant ERR_INVALID_CONTRACT (err u2009))

;; Fix the set-whitelisted function
(define-public (set-whitelisted (asset-contract principal) (whitelisted bool))
  (begin
    (asserts! (is-eq contract-owner tx-sender) ERR_UNAUTHORISED)
    (let ((self (as-contract tx-sender)))
      (asserts! (not (is-eq asset-contract self)) ERR_INVALID_CONTRACT)
      (map-set whitelisted-asset-contracts asset-contract whitelisted)
      (ok true)
    )
  )
)

(define-public (fulfil-listing-stx (listing-id uint) (nft-asset-contract <nft-trait>))
  (let (
    ;; Verify the given listing ID exists
    (listing (unwrap! (map-get? listings listing-id) ERR_UNKNOWN_LISTING))
    ;; Set the NFT's taker to the purchaser (caller of the function)
    (taker tx-sender)
    ;; Get the contract principal for validation
    (token-contract (contract-of nft-asset-contract))
  )
    ;; Validate that the purchase can be fulfilled
    (asserts! (is-eq token-contract (get nft-asset-contract listing)) ERR_ASSET_CONTRACT_MISMATCH)
    (try! (assert-can-fulfil token-contract none listing))
    
    ;; Verify the token-id is valid (greater than zero)
    (asserts! (> (get token-id listing) u0) ERR_INVALID_TOKEN_ID)
    
    ;; Transfer the NFT to the purchaser (caller of the function)
    (try! (as-contract (transfer-nft nft-asset-contract (get token-id listing) tx-sender taker)))
    
    ;; Verify the price is valid before the transfer
    (asserts! (> (get price listing) u0) ERR_INVALID_PRICE)
    
    ;; Transfer the STX payment from the purchaser to the creator of the NFT
    (try! (stx-transfer? (get price listing) taker (get maker listing)))
    
    ;; Remove the NFT from the marketplace listings
    (map-delete listings listing-id)
    
    ;; Return the listing ID that was just purchased
    (ok listing-id)
  )
)

(define-read-only (get-listing-nonce)
  (var-get listing-nonce)
)

(define-read-only (get-contract-owner)
  contract-owner
)

;; Define error constants

(define-public (fulfil-listing-ft
  (listing-id uint)
  (nft-asset-contract <nft-trait>)
  (payment-asset-contract <ft-trait>)
)
  (let (
    ;; Verify the given listing ID exists
    (listing (unwrap! (map-get? listings listing-id) ERR_UNKNOWN_LISTING))
    ;; Set the NFT's taker to the purchaser (caller of the function)
    (taker tx-sender)
    ;; Get the contract principals for validation
    (nft-contract (contract-of nft-asset-contract))
    (ft-contract (contract-of payment-asset-contract))
    ;; Get the expected payment contract from listing
    (expected-payment-contract (unwrap! (get payment-asset-contract listing) ERR_PAYMENT_CONTRACT_MISMATCH))
  )
    ;; Validate the NFT contract matches what's in the listing
    (asserts! (is-eq nft-contract (get nft-asset-contract listing)) ERR_ASSET_CONTRACT_MISMATCH)
    
    ;; Validate the payment contract matches what's in the listing
    (asserts! (is-eq ft-contract expected-payment-contract) ERR_PAYMENT_CONTRACT_MISMATCH)
    
    ;; Validate that the purchase can be fulfilled
    (try! (assert-can-fulfil nft-contract (some ft-contract) listing))
    
    ;; Verify the token-id is valid (greater than zero)
    (asserts! (> (get token-id listing) u0) ERR_INVALID_TOKEN_ID)
    
    ;; Verify the price is valid before the transfer
    (asserts! (> (get price listing) u0) ERR_INVALID_PRICE)
    
    ;; Transfer the NFT to the purchaser (caller of the function)
    (try! (as-contract (transfer-nft nft-asset-contract (get token-id listing) tx-sender taker)))
    
    ;; Transfer the tokens as payment from the purchaser to the creator of the NFT
    (try! (transfer-ft payment-asset-contract (get price listing) taker (get maker listing)))
    
    ;; Remove the NFT from the marketplace listings
    (map-delete listings listing-id)
    
    ;; Return the listing ID that was just purchased
    (ok listing-id)
  )
)

(define-private (transfer-ft (ft-contract <ft-trait>) (amount uint) (sender principal) (recipient principal))
  (contract-call? ft-contract transfer amount sender recipient none))

(define-private (assert-can-fulfil
  (nft-asset-contract principal)
  (payment-asset-contract (optional principal))
  (listing {
    maker: principal,
    taker: (optional principal),
    token-id: uint,
    nft-asset-contract: principal,
    expiry: uint,
    price: uint,
    payment-asset-contract: (optional principal)
  })
)
  (begin
    ;; Verify that the buyer is not the same as the NFT creator
    (asserts! (not (is-eq (get maker listing) tx-sender)) ERR_MAKER_TAKER_EQUAL)
    ;; Verify the buyer has been set in the listing metadata as its `taker`
    (asserts!
      (match (get taker listing) intended-taker (is-eq intended-taker tx-sender) true)
      ERR_UNINTENDED_TAKER
    )
    ;; Verify the listing for purchase is not expired
    (asserts! (< block-height (get expiry listing)) ERR_LISTING_EXPIRED)
    ;; Verify the asset contract used to purchase the NFT is the same as the one set on the NFT
    (asserts! (is-eq (get nft-asset-contract listing) nft-asset-contract) ERR_NFT_ASSET_MISMATCH)
    ;; Verify the payment contract used to purchase the NFT is the same as the one set on the NFT
    (asserts!
      (is-eq (get payment-asset-contract listing) payment-asset-contract)
      ERR_PAYMENT_ASSET_MISMATCH
    )
    (ok true)
  )
)
