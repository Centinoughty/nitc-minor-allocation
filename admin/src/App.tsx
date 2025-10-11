import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
  ShowGuesser,
  CustomRoutes,
  useListContext,
  ListContextProvider,
} from "react-admin";
import { DataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import { ThemeName, themes } from "./util/Themes/themes";
import { useStore } from "react-admin";
import { Layout } from "./components/Layout";
import Login from "./components/Login/Login";
import StudentsList from "./components/Screens/Students/StudentsList";
import CoursesList from "./components/Screens/Minors/MinorsList";
import { Route } from "react-router-dom";
import Timeline from "./components/Screens/Timeline";
import StudentWiseList from "./components/Screens/AllotmentDetails/StudentWise/StudentWiseList";
import CourseWiseList from "./components/Screens/AllotmentDetails/CourseWise/CourseWiseList";
import Settings from "./components/Screens/Settings";
import StudentsByCourse from "./components/Screens/AllotmentDetails/CourseWise/StudentsByCourse";
import { BASE_URL } from "./constants";
import CustomAppBar from "./components/Layout/AppBar";
import StudentList from "./components/Screens/Students/StudentList";
import StudentEdit from "./components/Screens/Students/StudentEdit";


export const App = () => {

  const [themeName] = useStore<ThemeName>("themeName", "soft");
  const lightTheme = themes.find((theme) => theme.name === themeName)?.light;
  const darkTheme = themes.find((theme) => theme.name === themeName)?.dark;


  return (
      <Admin
        dataProvider={DataProvider(BASE_URL)}
        authProvider={authProvider}
        disableTelemetry
        loginPage={Login}
        layout={Layout}
        lightTheme={lightTheme}
        darkTheme={darkTheme}
        defaultTheme="light"
      >
        <CustomAppBar />
        <Resource
          name="students"
          list={StudentsList}
          show={ShowGuesser}
          edit={StudentEdit}
        />
        <Resource
          name="minors"
          list={CoursesList}
          edit={EditGuesser}
          show={ShowGuesser}
        />
          <Resource
            name="studentwise"
            list={StudentWiseList}
            edit={EditGuesser}
          />
        <Resource
          name="coursewise"
          list={CourseWiseList}
          edit={EditGuesser}
        />
        <CustomRoutes>
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/coursewise/:id" element={<StudentsByCourse />} />
        </CustomRoutes>
      </Admin>
  )
};
