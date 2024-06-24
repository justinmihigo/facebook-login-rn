import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
const supabaseUrl = 'https://vaxjykeihsernxqxeyiy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheGp5a2VpaHNlcm54cXhleWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc0NDAzMTksImV4cCI6MjAzMzAxNjMxOX0.PbKiCmDG-U_1H0gkelN3_ze8_VE8lqIsc3pi5IH2bBA';
export default function App(){
WebBrowser.maybeCompleteAuthSession(); // required for web only
const redirectTo = makeRedirectUri({scheme:"com.mihigojustin.waves"});
console.log("redirectTo",redirectTo);
const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  console.log(data.session);
  return data.session;
};

const performOAuth = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });
  if (error) throw error;

  const res = await WebBrowser.openAuthSessionAsync(
    data?.url ?? "",
    redirectTo
  );

  if (res.type === "success") {
    const { url } = res;
    await createSessionFromUrl(url);
  }
};
  const supabase = createClient(
    supabaseUrl, supabaseAnonKey, {
      auth:{
      storage: AsyncStorage}
    }
  );
  const facebookLogin= async()=>{
     const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
  })
    if(error){
      console.log(error)
    }else{
      console.log(data)
    }
  }
  const url = Linking.useURL();
  console.log(url);
  if (url) createSessionFromUrl(url);
  return (
    <SafeAreaView>
    <View style={{marginVertical:20,flexDirection: "column",justifyContent:"center", alignItems:"center"}}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <TouchableOpacity style={{backgroundColor:"blue"}} onPress={performOAuth}>
        <Text>Login with facebook</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  )
}

// import { StatusBar } from 'expo-status-bar';
// import { Pressable, StyleSheet, Text, View, Dimensions, Animated} from 'react-native';
// import { useEffect, useState, useRef, useCallback } from 'react';
// import { AVMetadata, AVPlaybackStatusSuccess, Audio } from 'expo-av';
// import { Sound } from 'expo-av/build/Audio';
// const audio = require("./assets/akanyenga.mp3");
// const { width } = Dimensions.get('window');
// const WAVEFORM_ELEMENTS_COUNT = 50;

// export default function App() {
//   const [position, setPosition] = useState<number>(0);
//   const [duration, setDuration] = useState<number | any>(1);
//   const [sound, setSound] = useState<Sound | null>(null);
//   const progressAnim = useRef(new Animated.Value(0)).current;
//   const intervalRef = useRef<NodeJS.Timer | null>(null);
//   const [waveformHeights, setWaveformHeights] = useState<number[]>([]);
// //   const animatedStyles = useAnimatedStyle(()=>{
// //     return {
// //       backgroundColor: position > 0 ? withSpring('#246BFD', {
// //       }) : '#E9F0FF',
// //   };
// // })
//   const generateWaveformHeights = () => {
//     return Array.from({ length: WAVEFORM_ELEMENTS_COUNT }, () => Math.random() * 50 + 10);
//   };

//   const handlePlay = useCallback(async () => {
//     const { sound } = await Audio.Sound.createAsync(require('./assets/akanyenga.mp3'));
//     await sound.setRateAsync(1.0, false);
//     await sound.playAsync();
//     setSound(sound);
//    sound.setOnPlaybackStatusUpdate((status) => {
//       if (status.isLoaded) {
//         setPosition(status.positionMillis);
//         setDuration(status.durationMillis);
//       }
//     });
//   }, []);

//   const handlePause = useCallback(async () => {
//     await sound?.pauseAsync();
//   }, [sound]);

//   const handleStop = useCallback(async () => {
//     await sound?.stopAsync();
//   }, [sound]);

//   const handleSeek = useCallback(async (newPosition: number) => {
//     await sound?.setPositionAsync(newPosition);
//   }, [sound]);

//   const handleProgress = useCallback(async () => {
//     if (sound) {
//       const status = await sound.getStatusAsync();
//       if (status.isLoaded) {
//         setPosition(status.positionMillis);
//         setDuration(status.durationMillis);
//       }
//     }
//   }, [sound]);

//   useEffect(() => {
//     intervalRef.current = setInterval(() => {
//       handleProgress();
//     }, 1000);

//     return () => {
//       if (intervalRef.current) clearInterval(intervalRef.current as any);
//     };
//   }, [handleProgress]);

//   useEffect(() => {
//     if (position && duration) {
//       Animated.timing(progressAnim, {
//         toValue: (position / duration) * width,
//         duration: 1000,
//         useNativeDriver: false,
//       }).start();
//     }
//   }, [position, duration]);

//   useEffect(() => {
//     setWaveformHeights(generateWaveformHeights());
//   }, [sound]);

//   return (
//     <View style={styles.container}>
//       <Text>Open up App.tsx to start working on your app!</Text>
//       <View style={styles.waveformContainer}>
//         {waveformHeights.map((height, index) => {
//           const barWidth = width / WAVEFORM_ELEMENTS_COUNT;
//           return (
//             <Animated.View
//               key={index}
//               style={{
//                 height,
//                 width: barWidth,
//                 borderRadius: 20,
//                   backgroundColor: progressAnim.interpolate({
//                     inputRange: [0, width],
//                     outputRange: index <= (position / duration) * WAVEFORM_ELEMENTS_COUNT ? ['blue', 'blue'] : ['grey', 'grey'],
//                     extrapolate: 'clamp',
//                   }),
//               }}
            
//             />
//           );
//         })}
//       </View>
//       <View>
       
//       </View>
//       <StatusBar style="auto" />
//       <Pressable onPress={handlePlay}><Text>Play</Text></Pressable>
//       <Pressable onPress={handlePause}><Text>Pause</Text></Pressable>
//       <Pressable onPress={handleStop}><Text>Stop</Text></Pressable>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   waveformContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 1,
//     marginVertical: 20,
//   },
// });
