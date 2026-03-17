import { nativeEnv } from "@repo/env/native";
import { getHealthUrl, type HealthResponse } from "@repo/platform/health";
import { useQuery } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { QueryProvider } from "./providers/QueryProvider";

function MainScreen() {
	const { isPending, error, data } = useQuery({
		queryKey: ["health"],
		queryFn: () =>
			fetch(getHealthUrl(nativeEnv.EXPO_PUBLIC_API_BASE_URL)).then(
				(res) => res.json() as Promise<HealthResponse>,
			),
	});

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Laxiriir Expert Mobile</Text>

			<View style={styles.statusBox}>
				<Text style={styles.subtitle}>Go API Connection Status</Text>

				{isPending ? (
					<View style={styles.row}>
						<ActivityIndicator color="#f59e0b" />
						<Text style={{ color: "#f59e0b", marginLeft: 8 }}>
							Pinging backend...
						</Text>
					</View>
				) : error ? (
					<View style={styles.row}>
						<View style={[styles.dot, { backgroundColor: "#ef4444" }]} />
						<Text style={{ color: "#ef4444", marginLeft: 8 }}>
							Failed: {error.message}
						</Text>
					</View>
				) : (
					<View
						style={[
							styles.row,
							{
								backgroundColor: "rgba(16, 185, 129, 0.1)",
								padding: 8,
								borderRadius: 8,
							},
						]}
					>
						<View style={[styles.dot, { backgroundColor: "#10b981" }]} />
						<Text
							style={{ color: "#10b981", marginLeft: 8, fontWeight: "bold" }}
						>
							Connected! Status: {data?.status} ({data?.env})
						</Text>
					</View>
				)}
			</View>

			<StatusBar style="auto" />
		</View>
	);
}

export default function App() {
	return (
		<QueryProvider>
			<MainScreen />
		</QueryProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 24,
	},
	statusBox: {
		backgroundColor: "#fff",
		padding: 24,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: "#e5e7eb",
		width: "80%",
	},
	subtitle: {
		fontSize: 12,
		fontWeight: "600",
		color: "#6b7280",
		textTransform: "uppercase",
		marginBottom: 16,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	dot: {
		width: 12,
		height: 12,
		borderRadius: 6,
	},
});
