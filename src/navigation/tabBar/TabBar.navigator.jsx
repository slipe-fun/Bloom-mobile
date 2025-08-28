import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ROUTES } from "@constants/Routes";
import { CardScreen, PromocodeScreen } from "@screens";
import TabBar from "./TabBar";
import { fastSpring } from "@constants/Easings";
import { useUnistyles } from "react-native-unistyles";

const Tab = createBottomTabNavigator();

const options = {
	transitionSpec: {
		animation: "spring",
		config: {
			mass: fastSpring.mass,
			damping: fastSpring.damping,
			stiffness: fastSpring.stiffness,
		},
	},
};

export default function MainTabNavigator() {
  const {theme} = useUnistyles();

	return (
		<Tab.Navigator
			tabBar={props => <TabBar {...props} />}
			screenOptions={{
				headerShown: false,
				sceneStyle: {
					backgroundColor: theme.colors.background,
				},
				animation: "shift",
			}}
		>
			<Tab.Screen options={options} name={ROUTES.TAB_CHATS} component={CardScreen} />
			<Tab.Screen options={options} name={ROUTES.TAB_SEARCH} component={PromocodeScreen} />
			<Tab.Screen options={options} name={ROUTES.TAB_SETTINGS} component={PromocodeScreen} />
		</Tab.Navigator>
	);
}
