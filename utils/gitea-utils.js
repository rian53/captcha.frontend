
export const getGiteaOAuthUrl = (
	giteaId,
	clientId,
	giteaUrl,
	baseUrl,
) => {
	if (!clientId || !giteaUrl || !baseUrl) {
		// Return a marker that can be checked by the caller
		return "#";
	}

	const redirectUri = `${baseUrl}/api/providers/gitea/callback`;
	const scopes = "repo repo:status read:user read:org";

	return `${giteaUrl}/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
		redirectUri,
	)}&response_type=code&scope=${encodeURIComponent(scopes)}&state=${encodeURIComponent(giteaId)}`;
};