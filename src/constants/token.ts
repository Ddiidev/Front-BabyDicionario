import type { ITokenContract } from "@/contracts/tokenJwt/tokenJwt"

export default function getToken() : ITokenContract {
    const token : ITokenContract = JSON.parse(localStorage.getItem('access_secure') ?? "");
    return token;
}