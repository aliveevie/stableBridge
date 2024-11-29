;; get-user-address contract

;; public function to get the caller's address
(define-public (get-caller-address)
    (ok (tx-sender)))

;; read-only function to get the contract owner's address
(define-read-only (get-contract-owner)
    (contract-owner))

;; helper to get the contract's address
(define-read-only (get-contract-address)
    (as-contract tx-sender))
