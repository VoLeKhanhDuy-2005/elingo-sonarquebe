import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { tr } from '../../../utils/i18n'
import PostFormModal from '@/modules/community/components/PostFormModal/PostFormModal'

function PostFormModalHarness() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Open form
      </button>
      <PostFormModal
        isOpen={isOpen}
        groups={[]}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}

describe('PostFormModal', () => {
  it('stays open when the overlay is clicked', () => {
    render(<PostFormModalHarness />)

    fireEvent.click(document.querySelector('.post-form-modal__overlay'));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('clears validation errors after closing and reopening', () => {
    render(<PostFormModalHarness />);

    fireEvent.submit(screen.getByRole('dialog').querySelector('form'))

    expect(screen.getByText(tr('community:postForm.errors.groupRequired'))).toBeInTheDocument()
    expect(screen.getByText(tr('community:postForm.errors.titleRequired'))).toBeInTheDocument()
    expect(screen.getByText(tr('community:postForm.errors.contentRequired'))).toBeInTheDocument()

    fireEvent.click(document.querySelector('.post-form-modal__close-btn'))
    fireEvent.click(screen.getByRole('button', { name: 'Open form' }))

    expect(
      screen.queryByText(tr('community:postForm.errors.groupRequired'))
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(tr('community:postForm.errors.titleRequired'))
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(tr('community:postForm.errors.contentRequired'))
    ).not.toBeInTheDocument()
  })
})
