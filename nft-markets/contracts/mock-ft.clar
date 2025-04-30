(impl-trait .sip-010-trait-ft-standard.sip-010-trait)

(define-fungible-token mock-ft)

(define-read-only (get-name)
  (ok "Mock FT")
)

(define-read-only (get-symbol)
  (ok "MFT")
)

(define-read-only (get-decimals)
  (ok u6)
)

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance mock-ft account))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply mock-ft))
)

(define-read-only (get-token-uri)
  (ok (some u"https://example.com/ft-metadata"))
)

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    ;; Validate sender is the transaction sender
    (asserts! (is-eq tx-sender sender) (err u403))
    ;; Validate amount is greater than zero
    (asserts! (> amount u0) (err u401))
    ;; Validate recipient is not the sender
    (asserts! (not (is-eq sender recipient)) (err u402))
    ;; Perform the transfer
    (try! (ft-transfer? mock-ft amount sender recipient))
    ;; Handle memo if provided
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)

(define-public (mint (recipient principal) (amount uint))
  (begin
    ;; Validate amount is greater than zero
    (asserts! (> amount u0) (err u401))
    ;; Validate recipient is not null
    (asserts! (is-some (some recipient)) (err u404))
    ;; Perform the mint operation
    (try! (ft-mint? mock-ft amount recipient))
    (ok true)
  )
) 