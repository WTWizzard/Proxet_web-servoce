
export type Player = {
  username: String;
  vehicleType: Number;
  timeInsertingInLobby: Date;
};

export interface PlayersByType {
  type1: Player[];
  type2: Player[];
  type3: Player[];
}
export interface Teams {
    firstTeam: Player[],
    secondTeam: Player[]
}
