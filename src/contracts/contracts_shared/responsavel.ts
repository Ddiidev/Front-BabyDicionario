export enum Responsible {
	father = 0,
	mother = 1,
}

export function getNameResponsible(responsible?: Responsible): string {
	if (responsible == Responsible.father)
		return "Pai";
	else if (responsible == Responsible.mother)
		return "Mãe";
	else
		return "Filho";
}

export function getResponsibleValue(s: string): Responsible | undefined {
	const mapping: { [key: string]: Responsible } = {
		pai: Responsible.father,
		mae: Responsible.mother,
	};
	return mapping[s];
}