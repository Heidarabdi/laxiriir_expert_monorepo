package auth

import (
	"log"
	"sync"
)

type EmailSink struct {
	mu                  sync.RWMutex
	verificationByMail  map[string]string
	passwordResetByMail map[string]string
}

func NewEmailSink() *EmailSink {
	return &EmailSink{
		verificationByMail:  make(map[string]string),
		passwordResetByMail: make(map[string]string),
	}
}

func (s *EmailSink) RecordVerification(email string, url string) {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.verificationByMail[email] = url
	log.Printf("[auth] verification link for %s: %s", email, url)
}

func (s *EmailSink) RecordPasswordReset(email string, url string) {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.passwordResetByMail[email] = url
	log.Printf("[auth] password reset link for %s: %s", email, url)
}

func (s *EmailSink) VerificationURL(email string) string {
	s.mu.RLock()
	defer s.mu.RUnlock()

	return s.verificationByMail[email]
}

func (s *EmailSink) PasswordResetURL(email string) string {
	s.mu.RLock()
	defer s.mu.RUnlock()

	return s.passwordResetByMail[email]
}
