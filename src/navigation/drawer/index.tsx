import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomHeader from "./CustomHeader";
import HomeScreen from "../../screens/home/homescreen";

const Drawer = createDrawerNavigator();

export function MyDrawer({ navigation }) {
    return (
        <Drawer.Navigator
            screenOptions={{
                header: (props) => <CustomHeader {...props} navigation={navigation} />
            }}
        >
            <Drawer.Screen name="Home" component={HomeScreen} />
        </Drawer.Navigator>
    );
}

