import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import DeckFormModal from '@/modules/vocabulary/components/DeckFormModal/DeckFormModal';
import TopicFormModal from '@/modules/vocabulary/components/TopicFormModal/TopicFormModal';
import UserCardFormModal from '@/modules/vocabulary/components/UserCardFormModal/UserCardFormModal';

describe.each([
  {
    name: 'DeckFormModal',
    overlaySelector: '.deck-form-overlay',
    component: (onClose) => <DeckFormModal isOpen onClose={onClose} onSubmit={vi.fn()} />,
  },
  {
    name: 'TopicFormModal',
    overlaySelector: '.topic-form-overlay',
    component: (onClose) => <TopicFormModal isOpen onClose={onClose} onSubmit={vi.fn()} />,
  },
  {
    name: 'UserCardFormModal',
    overlaySelector: '.user-card-form-overlay',
    component: (onClose) => <UserCardFormModal isOpen onClose={onClose} onSubmit={vi.fn()} />,
  },
])('$name', ({ overlaySelector, component }) => {
  it('stays open when the overlay is clicked', () => {
    const onClose = vi.fn();
    render(component(onClose));

    fireEvent.click(document.querySelector(overlaySelector));

    expect(document.querySelector(overlaySelector)).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });
});
