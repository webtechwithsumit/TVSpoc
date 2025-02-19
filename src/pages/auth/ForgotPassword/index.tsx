import { FormInput, PageBreadcrumb, VerticalForm } from '@/components'
import config from '@/config'
import axios from 'axios'
import 'flatpickr/dist/themes/material_green.css'
import { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AuthLayout from '../AuthLayout'




const BottomLink = () => {
	return (
		<Row>
			<Col xs={12} className="text-center">
				<p className="text-dark-emphasis">
					Back To{' '}
					<Link to="/auth/login" className="text-dark fw-bold ms-1 link-offset-3 text-decoration-underline" >
						<b>Log In</b>
					</Link>
				</p>
			</Col>
		</Row>
	)

}

interface UserData {
	empID: string;
	fullname: string;
	password: string;
	confirmpassword: string;
}
const ForgotPassword = () => {

	const [otp, setOtp] = useState<string>("");
	const [otpVerify, setOtpVerify] = useState(false);

	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [showCPassword, setShowCPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [verifyEmpID, setVerifyEmpID] = useState(false);
	const [formData, setFormData] = useState<UserData>({
		empID: '',
		fullname: '',
		password: '',
		confirmpassword: '',
	});

	const [empIdError, setEmpIdError] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};
	const toggleCPasswordVisibility = () => {
		setShowCPassword(!showCPassword);
	};



	const handleOTP = async () => {
		try {
			const response = await axios.post(
				`${config.API_URL}/Login/VerifyOtp/verify-otp`,
				{
					email: formData.empID,
					otp: otp,
				}
			);
			if (response.data.isSuccess) {
				console.log(response.data);
				setVerifyEmpID(true);
				setOtpVerify(true);
			} else {
				setVerifyEmpID(false);
				setEmpIdError(response.data.message);
			}
		} catch (error) {
			console.error(error);
			setVerifyEmpID(false);
			setEmpIdError("Unable to verify OTP. Please try again later.");
			toast.dismiss();
			toast.error(
				<>Unable to verify OTP. Please try again later.
				</>,
				{ autoClose: 3000 }
			);
		}
	}

	const fetchEmployeeDetails = async (empID: string) => {
		try {
			const response = await axios.post(`${config.API_URL}/Login/SendOtp`, { email: empID });
			if (response.data.isSuccess) {
				const details = formData;
				setFormData({
					...formData,
					fullname: details.empID
				});
				setVerifyEmpID(true)
				setEmpIdError('')
			} else {
				setEmpIdError(
					response.data.message === "User not registered"
						? (
							<>User not registered <Link to="/auth/register" className='fw-bold text-success'> Sign Up <i className="ri-arrow-right-line"></i></Link></>
						)
						: response.data.message || 'Entered Wrong Employee ID'
				);
			}
		} catch (error: any) {
			setEmpIdError(error || 'Entered Wrong Emploee ID');
			toast.dismiss();
			toast.error(
				<>Wrong Employee ID. </>,
				{ autoClose: 3000 }
			);
			console.error(error)
		}
	};



	const [validationMessages, setValidationMessages] = useState([
		"Include a special character.",
		"Include an uppercase letter.",
		"Include a lowercase letter.",
		"Include a number.",
		"Length must be 8-16 characters.",
	]);

	useEffect(() => {
		const password = formData.password;
		const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
		const hasUppercase = /[A-Z]/.test(password);
		const hasLowercase = /[a-z]/.test(password);
		const hasNumber = /\d/.test(password);
		const isLengthValid = password.length >= 8 && password.length <= 16;

		const updatedMessages = [];
		if (!hasSpecialCharacter) updatedMessages.push("Include a special character.");
		if (!hasUppercase) updatedMessages.push("Include an uppercase letter.");
		if (!hasLowercase) updatedMessages.push("Include a lowercase letter.");
		if (!hasNumber) updatedMessages.push("Include a number.");
		if (!isLengthValid) updatedMessages.push("Length must be 8-16 characters.");

		setValidationMessages(updatedMessages);
	}, [formData.password]);


	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setLoading(false)
		if (name === "password") {
			setFormData((prevData) => ({ ...prevData, password: value }));
		} else if (name === "confirmpassword") {
			setConfirmPasswordError('')
			setFormData((prevData) => ({ ...prevData, confirmpassword: value }));
		} else if (name === "empID") {
			setEmpIdError('')
			setConfirmPasswordError('')
			setFormData((prevData) => ({
				...prevData,
				empID: value,
				fullname: "",
				dob: "",
				joiningDate: "",
				confirmpassword: "",
				password: "",
			}));
			setVerifyEmpID(false)
		} else {
			setFormData((prevData) => ({ ...prevData, [name]: value }));
		}
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		setLoading(true);
		if (formData.password === formData.confirmpassword) {
			try {
				const postData = {
					empID: formData.empID,
					empName: formData.fullname,
					password: formData.password,
					newPassword: formData.password,
					confirmPassword: formData.confirmpassword
				};

				const response = await axios.post(
					`${config.API_URL}/Login/UpdatePassword/update-password`,

					{
						...postData,
						userName: formData.empID,
						otp: otp,

					},
					{
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);


				if (response.status === 200) {
					setTimeout(() => {
						navigate('/auth/login');
					}, 3000);

					toast.dismiss();
					toast.success(
						<>Password Updated successfully! <br />
							Redirecting to Login...
						</>,
						{ autoClose: 3000 }
					);
					setVerifyEmpID(false)
					setFormData((prevData) => ({
						...prevData,
						empID: "",
						fullname: "",
						password: "",
						confirmpassword: "",
					}));

				} else {
					console.error('Password Update Failed:', response);
				}
			} catch (error: any) {
				toast.error(error);
			} finally {
				setLoading(false);
			}
		}
		else {
			setConfirmPasswordError("Password Do not Match");
		}
	};


	return (
		<div>
			<PageBreadcrumb title="Forgot Password" />
			<AuthLayout
				authTitle="Reset Password"
				bottomLinks={<BottomLink />}
			>
				<VerticalForm<UserData> onSubmit={onSubmit}>
					<Col className='position-relative'>
						<FormInput
							label="Username / Email"
							type="text"
							name="empID"
							placeholder="Enter  Username / email"
							value={formData.empID}
							onChange={handleInputChange}
							onBlur={() => {
								toast.dismiss();
								if (formData.empID) {
									fetchEmployeeDetails(formData.empID);
								}
							}}
							className={empIdError ? "mb-3 input-border" : " mb-3  "}
							required
						/>

						<div className="position-absolute signup-verify fs-11" style={{ borderLeft: 'none', cursor: 'pointer' }} >
							{verifyEmpID ? <i className="ri-checkbox-circle-fill fs-15 text-success "></i> : null}
						</div>
						<small className="text-danger signup-error">{empIdError}</small>
					</Col>

					{

						<Row>
							{!otpVerify && (
								<div>
									<Col>
										<FormInput
											label="Enter Otp"
											type="text"
											name="fullname"
											placeholder="Enter Otp"
											value={otp}
											onChange={(e) => setOtp(e.target.value)}
											className="mb-3"
										/>
										<Button className="btn btn-primary w-100 mt-2" onClick={handleOTP}>
											Verify OTP
										</Button>
									</Col>
								</div>
							)}

							{otpVerify && (
								<div>
									<Col lg={12}>
										<Form.Group controlId="password" className="mb-3">
											<Form.Label>Password</Form.Label>
											<div className="input-group">
												<Form.Control
													type={showPassword ? "text" : "password"}
													name="password"
													value={formData.password}
													onChange={handleInputChange}
													required
													placeholder="Enter Password"
												/>
												<button
													type="button"
													className="btn btn-outline-secondary"
													onClick={togglePasswordVisibility}
													style={{ border: "1px solid #ced4da", borderRadius: "0 .25rem .25rem 0" }}
												>
													{showPassword ? <i className="ri-eye-off-line"></i> : <i className="ri-eye-line"></i>}
												</button>
											</div>
											{formData.password.length > 0 && validationMessages.length > 0 && (
												<ul>
													{validationMessages.map((msg, index) => (
														<li key={index} className="text-danger">
															{msg}
														</li>
													))}
												</ul>
											)}
										</Form.Group>
									</Col>

									<Col lg={12} className="position-relative">
										<Form.Group controlId="confirmpassword" className="mb-3">
											<Form.Label>Confirm Password</Form.Label>
											<div className="input-group">
												<Form.Control
													type={showCPassword ? "text" : "password"}
													name="confirmpassword"
													value={formData.confirmpassword}
													onChange={handleInputChange}
													required
													placeholder="Enter Confirm Password"
												/>
												<button
													type="button"
													className="btn btn-outline-secondary"
													onClick={toggleCPasswordVisibility}
													style={{ border: "1px solid #ced4da", borderRadius: "0 .25rem .25rem 0" }}
												>
													{showCPassword ? <i className="ri-eye-off-line"></i> : <i className="ri-eye-line"></i>}
												</button>
											</div>
											<small className="text-danger signup-error">{confirmPasswordError}</small>
										</Form.Group>
									</Col>

									<div className="mb-0 d-grid text-center">
										{formData.empID &&
											formData.password &&
											formData.confirmpassword &&
											otpVerify ? (
											<Button
												variant="primary"
												className="fw-semibold"
												type="submit"
												disabled={loading}
											>
												Reset Password
											</Button>
										) : (
											<Button
												variant="primary"
												className="fw-semibold"
												type="submit"
											>
												Reset Password
											</Button>
										)}
									</div>
								</div>
							)}


						</Row>

					}


				</VerticalForm>
			</AuthLayout>
		</div>
	)
}

export default ForgotPassword
