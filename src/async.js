let todos;

function setTodos(todosa) {
    todos = todosa;
}

function getTodos() {
    //setTimeout(() => console.log(todos), 1001);
    return todos;
}

function addTodo(todo, cb) {
    setTimeout(() => { todos.push(todo); if (cb) cb(); }, 2000);
}

function removeTodo(todo, cb) {
    setTimeout(() => { todos.remove(todo); if (cb) cb(); }, 500);
}

function createPromise(name, delay, error) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Spent ${delay} milliseconds in this promise ${name}.`);

            if (error) {
                const err = new Error(`An error occurred in this promise ${name}.`);
                reject(err);
            } else
                resolve(`Promise ${name} resolved.`);
        }, delay);
    });
}


module.exports = { setTodos, getTodos, addTodo, removeTodo, createPromise };