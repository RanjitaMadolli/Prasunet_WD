const express = require('express');
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const router = express.Router();

// Create a task
router.post('/', auth, async (req, res) => {
    const { title } = req.body;
    try {
        const newTask = new Task({ userId: req.user.id, title });
        const task = await newTask.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all tasks
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update a task
router.put('/:id', auth, async (req, res) => {
    const { title, completed } = req.body;
    try {
        let task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        task = await Task.findByIdAndUpdate(req.params.id, { title, completed }, { new: true });
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        await task.remove();
        res.json({ msg: 'Task removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
