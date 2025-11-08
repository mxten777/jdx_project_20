import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NumberBall from '../components/NumberBall'

describe('NumberBall', () => {
  it('renders number correctly', () => {
    render(<NumberBall number={7} />)
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('applies selected styling', () => {
    render(<NumberBall number={7} isSelected={true} />)
    const ball = screen.getByText('7').parentElement
    expect(ball).toHaveClass('ring-4', 'ring-primary-400')
  })

  it('applies fixed styling and shows icon', () => {
    render(<NumberBall number={7} isFixed={true} />)
    const ball = screen.getByText('7').parentElement
    expect(ball).toHaveClass('ring-4', 'ring-gold-400')
    expect(screen.getByText('📌')).toBeInTheDocument()
  })

  it('applies excluded styling and shows icon', () => {
    render(<NumberBall number={7} isExcluded={true} />)
    const ball = screen.getByText('7').parentElement
    expect(ball).toHaveClass('opacity-30', 'grayscale')
    expect(screen.getByText('❌')).toBeInTheDocument()
  })

  it('shows animation when isAnimating is true', () => {
    render(<NumberBall number={7} isAnimating={true} />)
    const ball = screen.getByText('7').parentElement
    expect(ball).toHaveClass('animate-number-flip')
    expect(ball?.querySelector('.animate-ping')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<NumberBall number={7} onClick={handleClick} />)
    
    await user.click(screen.getByText('7'))
    expect(handleClick).toHaveBeenCalledWith(7)
  })

  it('is keyboard accessible', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<NumberBall number={7} onClick={handleClick} />)
    
    const ball = screen.getByRole('button')
    ball.focus()
    await user.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalledWith(7)
    
    await user.keyboard(' ')
    expect(handleClick).toHaveBeenCalledTimes(2)
  })

  it('applies different styles based on style prop', () => {
    const { rerender } = render(<NumberBall number={7} style="circle" />)
    let ball = screen.getByText('7').parentElement
    expect(ball).toHaveClass('rounded-full')

    rerender(<NumberBall number={7} style="square" />)
    ball = screen.getByText('7').parentElement
    expect(ball).toHaveClass('rounded-lg')

    rerender(<NumberBall number={7} style="diamond" />)
    ball = screen.getByText('7').parentElement
    expect(ball).toHaveClass('transform', 'rotate-45')
  })

  it('has correct aria-label', () => {
    render(<NumberBall number={7} isFixed={true} />)
    expect(screen.getByLabelText('로또 번호 7 (고정됨)')).toBeInTheDocument()
    
    render(<NumberBall number={8} isExcluded={true} />)
    expect(screen.getByLabelText('로또 번호 8 (제외됨)')).toBeInTheDocument()
  })
})