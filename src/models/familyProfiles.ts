import type { IProfile } from './profile';

export interface IFamilyProfiles {
	father: IProfile;
	mother: IProfile;
	babys: IProfile[];
}
