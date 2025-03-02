import React from 'react'

function TodoListCardView({ renderTodos }) {
    return (
        <>
         {renderTodos()}   
        </>
    )
}

export default TodoListCardView