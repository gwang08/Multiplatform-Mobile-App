import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface TeamFilterProps {
  teams: string[];
  selectedTeam: string | null;
  onTeamSelect: (team: string | null) => void;
}

export function TeamFilter({
  teams,
  selectedTeam,
  onTeamSelect,
}: TeamFilterProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];  // Ensure teams is always an array
  const safeTeams = Array.isArray(teams)
    ? teams.filter((team) => team && typeof team === "string" && team.trim() !== "")
    : [];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>Filter by Team</Text>      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Pressable
          style={[
            styles.teamButton,
            { borderColor: theme.tint },
            selectedTeam === null && { backgroundColor: theme.tint },
          ]}
          onPress={() => onTeamSelect(null)}
        >
          <Text
            style={[
              styles.teamText,
              {
                color:
                  selectedTeam === null
                    ? colorScheme === "dark"
                      ? "#000"
                      : "#fff"
                    : theme.tint,
              },
            ]}
          >
            All Teams
          </Text>
        </Pressable>        {safeTeams.map((team) => {
          const teamStr = String(team);
          return (
            <Pressable
              key={teamStr}
              style={[
                styles.teamButton,
                { borderColor: theme.tint },
                selectedTeam === team && { backgroundColor: theme.tint },
              ]}
              onPress={() => onTeamSelect(team)}
            >
              <Text
                style={[
                  styles.teamText,
                  {
                    color:
                      selectedTeam === team
                        ? colorScheme === "dark"
                          ? "#000"
                          : "#fff"
                        : theme.tint,
                  },
                ]}
              >
                {teamStr || "Unknown Team"}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  teamButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 80,
    alignItems: "center",
  },
  teamText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
