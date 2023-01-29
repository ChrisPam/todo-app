import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/Home.module.css";
import CompleteAll from "../components/CompleteAll";

export const url = "http://localhost:3000/api/task";

export interface Task {
  task: string,
  _id?: string,
  completed?: boolean
}

interface Props {
  tasks: Task[]
}

const Home: React.FC<Props> = (props) => {
    const [tasks, setTasks] = useState<Task[]>(props.tasks);
    const [task, setTask] = useState<Task>({ task: "" });
  
    const handleChange = ({ currentTarget: input }: React.ChangeEvent<HTMLInputElement>) => {
        input.value === ""
            ? setTask({ task: "" })
            : setTask((prev) => ({ ...prev, task: input.value }));
    };
  
    const addTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if(task.task !== '') {
                const { data } = await axios.post(url, task);
                setTasks((prev) => [...prev, data.data]);
                setTask({ task: "" });
            }
        } catch (error) {
            console.log(error);
        }
    };
  
    const updateTask = async (id: string | undefined) => {
        try {
            const originalTasks = [...tasks];
            const index = originalTasks.findIndex((t) => t._id === id);
            const { data } = await axios.put(url + "/" + id, {
                completed: !originalTasks[index].completed,
            });
            originalTasks[index] = data.data;
            setTasks(originalTasks);
        } catch (error) {
            console.log(error);
        }
    };
  
    const deleteTask = async (id: string | undefined) => {
        try {
            const { data } = await axios.delete(url + "/" + id);
            setTasks((prev) => prev.filter((task) => task._id !== id));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <main className={styles.main}>
			<h1 className={styles.heading}>TO-DO</h1>
			<div className={styles.container}>
				<form onSubmit={addTask} className={styles.form_container}>
					<input
						className={styles.input}
						type="text"
						placeholder="Task to be done..."
						onChange={handleChange}
						value={task.task}
					/>
					<button type="submit" className={styles.submit_btn}>
						{task._id ? "Update" : "Add"}
					</button>
				</form>
                {tasks.length > 0 && <CompleteAll tasks={tasks} setTasks={setTasks} />}
				{tasks.map((task) => (
					<div className={styles.task_container} key={task._id}>
						<input
							type="checkbox"
                            id={task._id + '_id'}
							className={styles.check_box}
							checked={task.completed}
							onChange={() => task._id && updateTask(task._id)}
						/>
						<p
							className={
								task.completed
									? styles.task_text + " " + styles.line_through
									: styles.task_text
							}
						>
							{task.task}
						</p>
						<button
							onClick={() => deleteTask(task?._id)}
							className={styles.remove_task}
						>
							&#10006;
						</button>
					</div>
				))}
				{tasks.length === 0 && <h2 className={styles.no_tasks}>No tasks</h2>}
			</div>
		</main>
	);
}

export const getServerSideProps = async () => {
	const { data } = await axios.get(url);
	return {
		props: {
			tasks: data.data,
		},
	};
};

export default Home;