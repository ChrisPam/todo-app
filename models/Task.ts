import mongoose, { Schema } from "mongoose";

const taskSchema: Schema = new mongoose.Schema({
	task: { type: String, required: true },
	completed: { type: Boolean, default: false },
});

export default mongoose.models.Task || mongoose.model<typeof taskSchema>("Task", taskSchema);