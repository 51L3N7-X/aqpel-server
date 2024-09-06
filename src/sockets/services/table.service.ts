import { Table } from "../../api/models/table";

export const getTableById = async (id: string) => {
  return Table.findById(id);
};
