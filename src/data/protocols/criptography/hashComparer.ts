export interface HashComparer {
  compare(password: string, hashed: string): Promise<boolean>;
}
