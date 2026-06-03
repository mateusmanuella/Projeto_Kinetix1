import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f7f8",
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 24
  },
  header: {
    marginBottom: 24
  },
  brand: {
    color: "#2fbf9f",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0
  },
  title: {
    color: "#17212b",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 12
  },
  subtitle: {
    color: "#52606d",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8
  },
  panel: {
    backgroundColor: "#ffffff",
    borderColor: "#dce3ea",
    borderRadius: 8,
    borderWidth: 1,
    padding: 18
  },
  field: {
    marginBottom: 14
  },
  label: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6
  },
  input: {
    borderColor: "#cbd5e1",
    borderRadius: 6,
    borderWidth: 1,
    color: "#17212b",
    height: 46,
    paddingHorizontal: 12
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#2fbf9f",
    borderRadius: 6,
    height: 48,
    justifyContent: "center",
    marginTop: 8
  },
  primaryButtonText: {
    color: "#17212b",
    fontSize: 15,
    fontWeight: "800"
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: "#cbd5e1",
    borderRadius: 6,
    borderWidth: 1,
    height: 46,
    justifyContent: "center"
  },
  secondaryButtonText: {
    color: "#17212b",
    fontWeight: "700"
  },
  link: {
    color: "#4f8cf7",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 16,
    textAlign: "center"
  },
  error: {
    backgroundColor: "#fff1f2",
    borderColor: "#fecdd3",
    borderRadius: 6,
    borderWidth: 1,
    color: "#be123c",
    marginBottom: 12,
    padding: 10
  },
  segmented: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 16
  },
  segment: {
    alignItems: "center",
    borderColor: "#cbd5e1",
    borderRadius: 6,
    borderWidth: 1,
    flex: 1,
    minHeight: 40,
    justifyContent: "center",
    paddingHorizontal: 6
  },
  segmentActive: {
    backgroundColor: "#17212b",
    borderColor: "#17212b"
  },
  segmentText: {
    color: "#52606d",
    fontSize: 10,
    fontWeight: "800"
  },
  segmentTextActive: {
    color: "#ffffff"
  },
  consent: {
    color: "#52606d",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 10
  },
  home: {
    flex: 1,
    backgroundColor: "#f5f7f8",
    justifyContent: "space-between",
    padding: 24,
    paddingTop: 64
  },
  homeTitle: {
    color: "#17212b",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 12
  },
  homeSubtitle: {
    color: "#52606d",
    marginTop: 8
  },
  emptyState: {
    backgroundColor: "#ffffff",
    borderColor: "#dce3ea",
    borderRadius: 8,
    borderWidth: 1,
    padding: 20
  },
  emptyTitle: {
    color: "#17212b",
    fontSize: 18,
    fontWeight: "800"
  },
  emptyText: {
    color: "#52606d",
    lineHeight: 22,
    marginTop: 8
  }
});
