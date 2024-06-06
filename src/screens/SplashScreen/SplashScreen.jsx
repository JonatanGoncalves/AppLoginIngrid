import { ActivityIndicator } from "react-native";
import { Surface } from "react-native-paper";

export default function SplashScreen() {
  return (
    <Surface>
      <ActivityIndicator size="large" color="#0000ff" />
    </Surface>
  );
}
