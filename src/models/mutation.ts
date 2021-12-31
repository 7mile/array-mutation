import SubArray from "./subArray";

type Mutation = SubArray<Mutation> & { _id?: number }

export default Mutation;