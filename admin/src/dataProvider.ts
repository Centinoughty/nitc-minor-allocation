import restProvider from "ra-data-simple-rest";
import { fetchUtils } from "react-admin";
import axios from "axios";

const DataDiffFinder = (oldData: any, newData: any) => {
  const diff: any = {};
  for (const key in newData) {
    if (Array.isArray(newData[key])) {
      if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
        diff[key] = newData[key];
      }
    } else if (oldData[key] !== newData[key]) {
      diff[key] = newData[key];
    }
  }
  return diff;
};

export const DataProvider = (apiUrl: string) => {
  const httpClient = (url: string, options: any = {}) => {
    if (!options.headers) {
      options.headers = new Headers({ Accept: "application/json" });
    }
    options.headers.set("Authorization", `Bearer ${localStorage.getItem("accessToken")}`);
    return fetchUtils.fetchJson(url, options);
  };

  const baseDataProvider = restProvider(apiUrl, httpClient);

  return {
    ...baseDataProvider,

    getList: async (resource: string, params: any) => {
      const { page, perPage } = params.pagination;
      const searchTerm = params.filter?.term || "";

      const headers = new Headers({
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      });

      if (resource === "students") {
        const url = `${apiUrl}/students?page=${page}&limit=${perPage}&search=${encodeURIComponent(
          searchTerm
        )}`;
        try {
          const response = await fetch(url, { headers });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          return {
            data: data.students.map((item: any) => ({ ...item, id: item._id })),
            total: data.totalStudents,
          };
        } catch (error) {
          console.error("Error fetching students:", error);
          throw error;
        }
      }

      // fallback to default
      const response = await baseDataProvider.getList(resource, params);
      return {
        data: response.data.map((item: any) => ({ ...item, id: item._id })),
        total: response.total,
      };
    },

    getOne: async (resource: string, params: any) => {
      const { id } = params;
      const headers = new Headers({
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      });

      if (resource === "students") {
        const url = `${apiUrl}/admin/student/${id}`;
        const response = await fetch(url, { headers });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return { data: { ...data, id: data._id } };
      }
      return baseDataProvider.getOne(resource, params);
    },

    update: async (resource: string, params: any) => {
      const { id, data } = params;
      if (resource === "students") {
        const diff = DataDiffFinder(params.previousData, data);
        if (Object.keys(diff).length === 0) {
          return { data: { id, ...params.previousData } };
        }
        const url = `${apiUrl}/admin/student/${id}`;
        const response = await axios.patch(url, diff, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        return { data: { id, ...response.data } };
      }
      return baseDataProvider.update(resource, params);
    },
  };
};
