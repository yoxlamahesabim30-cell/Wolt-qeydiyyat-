import React, { createContext, useCallback, useContext, useState } from 'react';
import { PreRegistrationModal } from '../components/PreRegistrationModal';

interface RegistrationModalContextValue {
  isOpen: boolean;
  openRegistrationModal: () => void;
  closeRegistrationModal: () => void;
}

const RegistrationModalContext = createContext<RegistrationModalContextValue | null>(null);

export const RegistrationModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openRegistrationModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeRegistrationModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <RegistrationModalContext.Provider
      value={{ isOpen, openRegistrationModal, closeRegistrationModal }}
    >
      {children}
      <PreRegistrationModal isOpen={isOpen} onClose={closeRegistrationModal} />
    </RegistrationModalContext.Provider>
  );
};

export function useRegistrationModal(): RegistrationModalContextValue {
  const ctx = useContext(RegistrationModalContext);
  if (!ctx) {
    throw new Error('useRegistrationModal must be used within a RegistrationModalProvider');
  }
  return ctx;
}
