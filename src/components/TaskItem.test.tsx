import { fireEvent, render, screen } from '@testing-library/react'
import { TaskItem } from './TaskItem'

const task = {
  id: 'task-1',
  text: 'Write a test',
  completed: false
}

describe('TaskItem', () => {
  it('reports the next checked value once when the checkbox is clicked', () => {
    const onToggle = jest.fn()

    render(
      <TaskItem
        task={task}
        onToggle={onToggle}
        onDelete={jest.fn()}
        onSwipeOpen={jest.fn()}
        onSwipeClose={jest.fn()}
        isSwipeOpen={false}
        isDeleting={false}
        isMoving={false}
      />
    )

    fireEvent.click(screen.getByRole('checkbox'))

    expect(onToggle).toHaveBeenCalledTimes(1)
    expect(onToggle).toHaveBeenCalledWith('task-1', true)
  })

  it('does not reveal the delete action for a tap', () => {
    const onSwipeOpen = jest.fn()

    render(
      <TaskItem
        task={task}
        onToggle={jest.fn()}
        onDelete={jest.fn()}
        onSwipeOpen={onSwipeOpen}
        onSwipeClose={jest.fn()}
        isSwipeOpen={false}
        isDeleting={false}
        isMoving={false}
      />
    )

    const taskItem = screen.getByText('Write a test').closest('.task-item')
    fireEvent.touchStart(taskItem!, { touches: [{ clientX: 100 }] })
    fireEvent.touchEnd(taskItem!)

    expect(onSwipeOpen).not.toHaveBeenCalled()
    expect(taskItem).not.toHaveClass('swiped')
  })

  it('calls onSwipeOpen when swiped past the threshold', () => {
    const onSwipeOpen = jest.fn()

    render(
      <TaskItem
        task={task}
        onToggle={jest.fn()}
        onDelete={jest.fn()}
        onSwipeOpen={onSwipeOpen}
        onSwipeClose={jest.fn()}
        isSwipeOpen={false}
        isDeleting={false}
        isMoving={false}
      />
    )

    const taskItem = screen.getByText('Write a test').closest('.task-item')!
    fireEvent.touchStart(taskItem, { touches: [{ clientX: 100 }] })
    fireEvent.touchMove(taskItem, { touches: [{ clientX: 50 }] })
    fireEvent.touchEnd(taskItem)

    expect(onSwipeOpen).toHaveBeenCalledTimes(1)
    expect(onSwipeOpen).toHaveBeenCalledWith('task-1')
  })

  it('does not call onSwipeOpen when swiped below the threshold', () => {
    const onSwipeOpen = jest.fn()

    render(
      <TaskItem
        task={task}
        onToggle={jest.fn()}
        onDelete={jest.fn()}
        onSwipeOpen={onSwipeOpen}
        onSwipeClose={jest.fn()}
        isSwipeOpen={false}
        isDeleting={false}
        isMoving={false}
      />
    )

    const taskItem = screen.getByText('Write a test').closest('.task-item')!
    fireEvent.touchStart(taskItem, { touches: [{ clientX: 100 }] })
    fireEvent.touchMove(taskItem, { touches: [{ clientX: 90 }] })
    fireEvent.touchEnd(taskItem)

    expect(onSwipeOpen).not.toHaveBeenCalled()
  })

  it('calls onDelete when a delete button is clicked', () => {
    const onDelete = jest.fn()

    render(
      <TaskItem
        task={task}
        onToggle={jest.fn()}
        onDelete={onDelete}
        onSwipeOpen={jest.fn()}
        onSwipeClose={jest.fn()}
        isSwipeOpen={false}
        isDeleting={false}
        isMoving={false}
      />
    )

    const deleteButtons = screen.getAllByRole('button', {
      name: 'Delete task: Write a test'
    })
    fireEvent.click(deleteButtons[0])

    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onDelete).toHaveBeenCalledWith('task-1')
  })

  it('applies the swiped class when isSwipeOpen is true', () => {
    render(
      <TaskItem
        task={task}
        onToggle={jest.fn()}
        onDelete={jest.fn()}
        onSwipeOpen={jest.fn()}
        onSwipeClose={jest.fn()}
        isSwipeOpen={true}
        isDeleting={false}
        isMoving={false}
      />
    )

    const taskItem = screen.getByText('Write a test').closest('.task-item')
    expect(taskItem).toHaveClass('swiped')
  })

  it('does not apply the swiped class when isSwipeOpen is false', () => {
    render(
      <TaskItem
        task={task}
        onToggle={jest.fn()}
        onDelete={jest.fn()}
        onSwipeOpen={jest.fn()}
        onSwipeClose={jest.fn()}
        isSwipeOpen={false}
        isDeleting={false}
        isMoving={false}
      />
    )

    const taskItem = screen.getByText('Write a test').closest('.task-item')
    expect(taskItem).not.toHaveClass('swiped')
  })
})
