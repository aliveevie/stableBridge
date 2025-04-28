(impl-trait .nft-trait.nft-trait)

(define-non-fungible-token mock-nft uint)

(define-data-var last-token-id uint u0)

(define-read-only (get-last-token-id)
  (ok (var-get last-token-id))
)

(define-read-only (get-token-uri (token-id uint))
  (ok (some "https://example.com/nft"))
)

(define-read-only (get-owner (token-id uint))
  (ok (nft-owner? mock-nft token-id))
)

(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq sender tx-sender) (err u403))
    (nft-transfer? mock-nft token-id sender recipient)
  )
)

(define-public (mint (recipient principal))
  (let
    ((token-id (+ (var-get last-token-id) u1)))
    (var-set last-token-id token-id)
    (nft-mint? mock-nft token-id recipient)
  )
) 