import { AntDesign } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Pressable, View } from "react-native";
// import * as SplashScreen from 'expo-splash-screen';
import "react-native-reanimated";

// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#164f63" },
        headerTintColor: "white",
        statusBarTranslucent: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Signal",
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignContent: "center",
                gap: 20,
                marginHorizontal: 10,
              }}
            >
              <Pressable
                onPress={() => router.push({ pathname: "/EditMessage" })}
              >
                {({ pressed }) => (
                  <AntDesign
                    name="edit"
                    size={24}
                    color={pressed ? "gray" : "white"}
                    style={{
                      textAlign: "center",
                      borderRadius: 25,
                    }}
                  />
                )}
              </Pressable>
              <Pressable
                onPress={() => router.push({ pathname: "/TrustedContacts" })}
              >
                {({ pressed }) => (
                  <AntDesign
                    name="contacts"
                    size={24}
                    color={pressed ? "gray" : "white"}
                    style={{
                      textAlign: "center",
                      borderRadius: 25,
                    }}
                  />
                )}
              </Pressable>
            </View>
          ),
        }}
      />
      <Stack.Screen name="TrustedContacts" options={{
        headerTitle: "Trusted Contacts",
      }}/>
      <Stack.Screen name="EditMessage" options={{
        headerTitle: "Edit Message",
      }}/>
    </Stack>
  );
}
