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
  (ok (nft-get-owner? mock-nft token-id))
)

(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    ;; Validate sender is the transaction sender
    (asserts! (is-eq tx-sender sender) (err u403))
    ;; Validate token-id exists
    (asserts! (is-some (nft-get-owner? mock-nft token-id)) (err u404))
    ;; Validate recipient is not the sender
    (asserts! (not (is-eq sender recipient)) (err u402))
    ;; Perform the transfer
    (try! (nft-transfer? mock-nft token-id sender recipient))
    (ok true)
  )
)

(define-public (mint (recipient principal))
  (let
    ((token-id (+ (var-get last-token-id) u1)))
    ;; Validate recipient is not null
    (asserts! (is-some (some recipient)) (err u404))
    ;; Update the last token ID
    (var-set last-token-id token-id)
    ;; Perform the mint operation
    (try! (nft-mint? mock-nft token-id recipient))
    (ok token-id)
  )
) 