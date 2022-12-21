import { createAsyncThunk } from "@reduxjs/toolkit";
import Utils from "../../app/components/NodesMap/Utils";

export const loadLocationNodes = createAsyncThunk("locationNodes", async () => {
  let nodesData = await Utils.getNodeData();
  return nodesData;
});