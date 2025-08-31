import { createContext, useEffect, useState } from "react";
import { fetchDocumentsRealtime } from "../services/firebaseService";

export const NodeContext = createContext();

function NodesProvider({ children }) {
  const [nodes, setNodes] = useState([]);
  useEffect(() => {
    const unsubscribe = fetchDocumentsRealtime("nodes", (nodeLists) => {
      setNodes(nodeLists);
    });

    return () => unsubscribe();
  }, []);

  return <NodeContext.Provider value={nodes}>{children}</NodeContext.Provider>;
}

export default NodesProvider;
