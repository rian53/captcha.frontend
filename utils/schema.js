import { z } from "zod";
import { zfd } from "zod-form-data";

if (typeof window === "undefined") {
	void (async () => {
		const undici = await import("undici");
		globalThis.File = undici.File;
		// @ts-ignore
		globalThis.FileList = undici.FileList;
	})();
}

export const uploadFileSchema = zfd.formData({
	applicationId: z.string().optional(),
	zip: zfd.file(),
	dropBuildPath: z.string().optional(),
});
