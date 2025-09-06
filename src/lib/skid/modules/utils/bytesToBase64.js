import { Buffer } from "@craftzdog/react-native-buffer";

export default function (data) {
    return Buffer.from(data).toString("base64");
}