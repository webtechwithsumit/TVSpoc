import React, { ReactNode, useEffect } from 'react'

import authImg from '@/assets/images/login-side.jpg'
import axisBank from '@/assets/images/logotvs.png'


import { Card, Col, Container, Image, Row } from 'react-bootstrap'

interface AccountLayoutProps {
	pageImage?: string
	authTitle?: string
	helpText?: string
	bottomLinks?: ReactNode
	isCombineForm?: boolean
	children?: ReactNode
	hasForm?: boolean
	hasThirdPartyLogin?: boolean
	userImage?: string
	starterClass?: boolean
}

const AuthLayout = ({
	authTitle,
	helpText,
	bottomLinks,
	children,
	hasThirdPartyLogin,
	userImage,
	starterClass,
}: AccountLayoutProps) => {

	useEffect(() => {
		if (document.body) {
			document.body.classList.add('authentication-bg', 'position-relative')
		}

		return () => {
			if (document.body) {
				document.body.classList.remove('authentication-bg', 'position-relative')
			}
		}
	}, [])

	return (
		<div className="authentication-bg position-relative">

			<div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5 position-relative">
				<Container>
					<Row className="justify-content-center">
						<Col lg={8}>

							<Card className="overflow-hidden" style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }} >
								<Row className="g-0">
									<Col lg={6} className="d-none d-lg-block p-2">
										<Image
											src={authImg}
											alt=""
											className="img-fluid rounded h-100 "
											style={{ objectFit: 'cover' }}
										/>
									</Col>
									<Col lg={6}>
										<div className="d-flex flex-column h-100">
											<div className="auth-brand px-4  d-flex justify-content-center">
												{/* <span className='fs-1 fw-bold'> TVS</span> */}
												<a href="index.html" className="logo-light">
													<Image src={axisBank} alt="logo" height="62" />
												</a>
												<a href="index.html" className="logo-dark p-2">
													<Image src={axisBank} alt="dark logo" height="80" />
												</a>
											</div>
											<div
												className={`px-4 pb-3 pt-2 my-auto ${starterClass ? 'text-center' : ''
													}`}
											>
												{userImage ? (
													<div className="text-center w-75 m-auto">
														<Image
															src={userImage}
															height={64}
															alt="user-image"
															className="rounded-circle img-fluid img-thumbnail avatar-xl"
														/>
														<h4 className="text-center mt-3 fw-bold fs-20">
															{authTitle}{' '}
														</h4>
														<p className="text-muted mb-4">{helpText}</p>
													</div>
												) : (
													<React.Fragment>
														<h4 className="fs-20">{authTitle}</h4>
														<p className="text-muted mb-3">{helpText}</p>
													</React.Fragment>
												)}

												{children}
											</div>
										</div>
									</Col>
								</Row>
							</Card>
						</Col>
					</Row>
					{bottomLinks}
				</Container>
			</div>

		</div >
	)
}

export default AuthLayout
