import { PasswordReset } from "../../models/PasswordReset";
import { User } from "../../models/User";
import { sendError, sendSuccess } from "../../utils/helpers/responseHelper";
import { sendEmail } from "../nodemailer/mailServive";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv({path: '.env'})

export const resetPassword = async (req: any, res: any) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, "User not found", 404);
    }
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );
    const expires = new Date(Date.now() + 3600000);
    await PasswordReset.create({
      userId: user._id,
      token: resetToken,
      expires,
    });

    const resetLink = `${process.env.BASE_URL}/confirm-reset-password?token=${resetToken}`;

    await sendEmail(
      user.email,
      "Password reset request",
      `To reset your password click the following link:\n${resetLink}`
    );
    return sendSuccess(res, {}, "Password reset token sent to your email", 200);
  } catch (error: any) {
    return sendError(res, "Request failed", 500, error);
  }
};
