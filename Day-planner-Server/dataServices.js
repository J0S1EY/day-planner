const mongoose = require('mongoose')
const db = require('./todoDb')
const jwt = require('jsonwebtoken')
const express = require('express');

// register
const signup = (username, password) => {
    // console.log(username, password)
    return db.Todotasks.findOne({
        username
    }).then((result) => {
        if (result) {
            console.log('username already exist')
            return {
                status: false,
                message: "Account Exist",
                statusCode: 404
            }
        } else {
            console.log('register success')
            let newTodotasks = new db.Todotasks({
                username,
                password,
                taskCount: {
                    completedTask: 0,
                    pendingTask: 0,
                    canceledTask: 0,
                    deletedTask: 0,
                    totalTask: 0
                },
                taskList: []
            })
            newTodotasks.save()
            return {
                status: true,
                message: 'register success',
                statusCode: 200
            }
        }
    }).catch((error) => {
        console.log(error)
    })
}
// login user
const login = (user, pswd) => {
    // console.log(user,pswd)
    return db.Todotasks.findOne({
        username: user, password: pswd
    }).then((result) => {

        if (result) {
            // jwt token 
            const token = jwt.sign({
                jwtuser: result.username,
                jwtpswd: result.password
            }, 'mytodo')
            return {
                status: true, message: "login successfull", username: result.username, statusCode: 200, token
            }
        } else {
            return {
                status: false, message: "invalid account or password", statusCode: 404,
            }
        }
    }).catch((error) => {
        console.log(error)
    })
}
// add new task
const newTask = (user, pswd, id, title, task) => {
    return db.Todotasks.findOne({ username: user }).then((result) => {
        if (result.password === pswd) {
            result.taskList.push({
                taskId: id,
                title,
                task,
                taskStatus: "pending"
            })
            result.taskCount.pendingTask += 1,
                result.taskCount.totalTask += 1,
                result.save()
            return {
                status: true, message: "Task added successfully", statusCode: 200
            }
        } else {
            return {
                status: false, message: "Task adding process failed", statusCode: 404
            }
        }
    })
}
// get all task
const gettaskList = (user, pswd,) => {
    return db.Todotasks.findOne({ username: user }).then((result) => {
        if (result.password === pswd) {
            let data = result.taskList
            let taskCount = result.taskCount
            //  console.log("all task ", data)
            return {
                status: true,
                message: ('successfully fetch tasks'),
                statusCode: 200,
                data,
                taskCount
            }
        } else {
            return {
                status: false,
                message: ('Operation Denied'),
                statusCode: 404
            }
        }
    })
}

// task completation
const taskStatus = (user, pswd, objId, status) => {
    return db.Todotasks.findOneAndUpdate(
        {
            username: user,
            password: pswd,
            "taskList._id": objId // Match the task with the specified _id in the taskList array
        },
        {
            $set: {
                "taskList.$.taskStatus": status, // Update the taskStatus field of the matched task
            }
        },
        { new: true } // Return the updated document

    )
        .then(result => {
            if (!result) {
                return {
                    status: false,
                    message: "Task not found or incorrect credentials",
                    statusCode: 404
                };
            }
            switch (status) {
                case "completed":
                    {
                        result.taskCount.completedTask += 1
                        result.taskCount.pendingTask -= 1
                        result.save()
                        return {
                            status: true,
                            message: ('Successfully completed your tasks'),
                            statusCode: 200,

                        }
                    }
                case "canceled":
                    {
                        result.taskCount.canceledTask += 1
                        result.taskCount.pendingTask -= 1
                        result.save()
                        return {
                            status: true,
                            message: ('Successfully canceled your tasks'),
                            statusCode: 200,
                        }
                    }
                default:
                    {
                        return {
                            status: false,
                            message: ('Somthing went wrong try again'),
                            statusCode: 404
                        }
                    }
            }
        }).catch((err) => {
            console.error(err);
            return {
                status: false,
                message: 'An error occurred. Please try again later.',
                statusCode: 500
            };
        });
}
//Task Delete
const taskDelete = (user, objId) => {
    return db.Todotasks.findOneAndUpdate(
        { username: user }, { $pull: { taskList: { _id: objId } } }, { new: true }).then(async (result) => {
            if (result) {
                result.taskCount.pendingTask -= 1
                result.taskCount.deletedTask += 1
                result.taskCount.totalTask -= 1
                await result.save();
                return {
                    status: true,
                    message: 'Successfully deleted your task',
                    statusCode: 200
                };
            } else {
                return {
                    status: false,
                    message: 'Something went wrong. Please try again.',
                    statusCode: 404
                };
            }
        }).catch((err) => {
            console.error(err);
            return {
                status: false,
                message: 'An error occurred. Please try again later.',
                statusCode: 500
            };
        });
};

// exporting login 
module.exports = {
    signup,
    login,
    newTask,
    gettaskList,
    taskStatus,
    taskDelete
}