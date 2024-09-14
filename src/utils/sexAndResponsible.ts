import type { Responsible } from "@/contracts/contracts_shared/responsavel";
import { Sex } from "@/views/profileEdit/profileEdit";

export function getSexDefaultFromResponsible(responsible: Responsible): Sex {
    if (responsible === null || responsible === undefined) {
        throw new Error('Responsible is null or undefined');
    }
    
    return Sex[Sex[Number(responsible)] as keyof typeof Sex];
}
