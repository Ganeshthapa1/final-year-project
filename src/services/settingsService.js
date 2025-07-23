import api from "./api";

export const fetchSettings = async () => {
  return api.get("/setting");
};

export const updateSettings = async (settings) => {
  return api.post("/settings", settings);
};
