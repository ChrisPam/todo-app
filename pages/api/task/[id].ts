import Task from "../../../models/Task";
import dbConnect from "../../../utils/dbConnect";

interface Request {
  method: string;
  query: {
    id: string;
  };
  body: any;
}
interface Response {
  status: (statusCode: number) => Response;
  json: (payload: any) => void;
}

export default async (req: Request, res: Response) => {
  const { method, query } = req;
  const { id } = query;

  // Connect to database
  await dbConnect();

  if (method === "PUT") {
		try {
			const result = await Task.findByIdAndUpdate(
				id,
				{ $set: req.body },
				{ new: true }
			);

			res
				.status(200)
				.json({ data: result, message: "Task Updated Successfully" });
		} catch (error) {
			res.status(500).json({ message: "Internal Server Error" });
			console.log(error);
		}
	}
  
  if (method === "DELETE") {
    try {
      await Task.findByIdAndDelete(id);
      res.status(200).json({ message: "Task Deleted Successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
      console.log(error);
    }
  }
};
