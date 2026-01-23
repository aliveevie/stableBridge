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
    (asserts! (is-eq sender tx-sender) (err u403))
    (ft-transfer? mock-ft amount sender recipient)
  )
)

(define-public (mint (recipient principal) (amount uint))
  (ft-mint? mock-ft amount recipient)
) 
