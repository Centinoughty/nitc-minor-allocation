import restProvider from "ra-data-simple-rest";
import cookie from "cookie";
import { fetchUtils } from 'react-admin';
import { accessToken } from "./constants";
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

    // add your own headers here
    const token = localStorage.getItem('authToken'); // Get token from localStorage or other storage
    options.headers.set('Authorization', `Bearer ${localStorage.getItem("accessToken")}`);

    return fetchUtils.fetchJson(url, options);
  }

  const baseDataProvider = restProvider(apiUrl, httpClient);

  const minStudents = localStorage.getItem("minStudents");
  const maxStudents = localStorage.getItem("maxStudents");

  return {
    ...baseDataProvider,

    getList: async (resource: string, params: any) => {
      const { page, perPage } = params.pagination;
      const { q } = params.filter;

      const cookies = cookie.parse(document.cookie);
      console.log("Auth Token", localStorage.getItem("accessToken"));
      const accessToken = localStorage.getItem("accessToken");
      const headers = new Headers({
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      });

      if (resource === "studentwise") {
        const searchTerm = params.filter.q || ""; 
        const url = `${apiUrl}/admin/allocate/students?max=${maxStudents}&min=${minStudents}&page=${page}&limit=${perPage}&search=${encodeURIComponent(searchTerm)}`;

        try {
          const response = await fetch(url, { headers });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json(); // await the response
          return {
            data: data.students.map((item: any) => ({ ...item, id: item.student._id })),
            total: data.totalStudents,
          };
        } catch (error) {
          console.error("Error fetching studentwise:", error);
          throw error;
        }
      }
      else if (resource === "coursewise") {
        const courseId = params.filter.courseId;
        if (courseId === undefined) {
          const url = `${apiUrl}/admin/allocate?max=${maxStudents}&min=${minStudents}`;

          try {
            const response = await fetch(url, { headers });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json(); // await the response
            return {
              data: data.courseWise.data.map((item: any) => ({ ...item, id: item.course._id })),
              total: data.courseWise.data.length,
            };
          } catch (error) {
            console.error("Error fetching studentwise:", error);
            throw error;
          }
        }
        else {
          const url = `${apiUrl}/admin/allocate/minor/${courseId}?max=${maxStudents}&min=${minStudents}`;
          const resp = await fetch(url, { headers });
          const data = await resp.json();
          return {
            data: data.map((item: any, index: number) => ({ ...item, id: index })),
            total: data.length,
          };
        }
      }
      else if (resource === "students") {
        const searchTerm = params.filter.q || "";
        const url = `${apiUrl}/students?page=${page}&limit=${perPage}&search=${encodeURIComponent(searchTerm)}`;
        try {
          const response = await fetch(url, { headers });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          } else {
            const data = await response.json();
            return {
              data: data.students.map((item: any) => ({ ...item, id: item._id })),
              total: data.totalStudents,
            };
          }
        } catch (error) {
          console.error("Error fetching students:", error);
          throw error;
        }
      }
      try {
        const response = await baseDataProvider.getList(resource, params);
        return {
          data: response.data.map((item: any) => ({ ...item, id: item._id })), // map _id to id
          total: response.total,
        };
      } catch (error) {
        console.error(`Error fetching ${resource}:`, error);
        throw error;
      }
    },
    getOne: async (resource: string, params: any) => {
      const { id } = params;
      const headers = new Headers({
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      });

      if (resource === "students") {
        const url = `${apiUrl}/admin/student/${id}`;
        try {
          const response = await fetch(url, { headers });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          return {
            data: { ...data, id: data._id },
          };
        } catch (error) {
          console.error("Error fetching student:", error);
          throw error;
        }
      }
    },
    update: async (resource: string, params: any) => {
      const { id, data } = params;
      console.log("Previous Data", params.previousData);
      console.log("New Data", data);

      const headers = new Headers({
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      });

      if (resource === "students") {
        const diff = DataDiffFinder(params.previousData, data);
        console.log("Computed Diff", diff); 

        if (Object.keys(diff).length === 0) {
          console.log("No changes detected, skipping update.");
          return {
            data: { id, ...params.previousData }, 
          };
        }

        const url = `${apiUrl}/admin/student/${id}`;
        try {
          const response = await axios.patch(url, diff, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });

          if (response.status != 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          console.log("Response from API", response);
          const updatedData = await response.data;
          console.log("Updated Data from API", updatedData);

          return {
            data: { id, ...updatedData },
          };

        } catch (error) {
          console.error("Error updating student:", error);
          throw error;
        }
      }
    },
  };
};
