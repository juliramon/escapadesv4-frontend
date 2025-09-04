import { useState } from "react";

const AdBannerShortcodeHelper = ({ onInsertShortcode }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedSlot, setSelectedSlot] = useState("");
	const [selectedFormat, setSelectedFormat] = useState("auto");
	const [isResponsive, setIsResponsive] = useState(true);
	const [customStyle, setCustomStyle] = useState("");

	const commonSlots = [
		{ value: "4940975412", label: "Banner Lateral" },
		{ value: "9222117584", label: "Banner Horizontal" },
		{ value: "1234567890", label: "Banner Cuadrado" },
	];

	const formatOptions = [
		{ value: "auto", label: "Automático" },
		{ value: "rectangle", label: "Rectángulo" },
		{ value: "horizontal", label: "Horizontal" },
		{ value: "vertical", label: "Vertical" },
	];

	const generateShortcode = () => {
		let shortcode = "[ad_banner";

		if (selectedSlot) {
			shortcode += ` slot="${selectedSlot}"`;
		}

		if (selectedFormat !== "auto") {
			shortcode += ` format="${selectedFormat}"`;
		}

		if (!isResponsive) {
			shortcode += ` responsive="false"`;
		}

		if (customStyle) {
			shortcode += ` style="${customStyle}"`;
		}

		shortcode += "]";

		return shortcode;
	};

	const handleInsert = () => {
		const shortcode = generateShortcode();
		if (onInsertShortcode) {
			onInsertShortcode(shortcode);
		}
		setIsOpen(false);
		// Reset form
		setSelectedSlot("");
		setSelectedFormat("auto");
		setIsResponsive(true);
		setCustomStyle("");
	};

	const examples = [
		{
			code: "[ad_banner]",
			description: "Banner básico con configuración predeterminada",
		},
		{
			code: '[ad_banner slot="4940975412"]',
			description: "Banner con slot específico",
		},
		{
			code: '[ad_banner slot="9222117584" format="horizontal"]',
			description: "Banner horizontal con slot personalizado",
		},
		{
			code: '[ad_banner format="rectangle" responsive="false"]',
			description: "Banner rectángulo no responsivo",
		},
		{
			code: '[ad_banner style="max-width-md"]',
			description: "Banner con estilos CSS personalizados",
		},
	];

	if (!isOpen) {
		return (
			<button
				onClick={() => setIsOpen(true)}
				className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
				type="button"
			>
				<svg
					className="h-4 w-4 mr-2"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
				Insertar Banner Publicitario
			</button>
		);
	}

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto">
			<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
				<div
					className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
					onClick={() => setIsOpen(false)}
				></div>

				<div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
					<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
						<div className="sm:flex sm:items-start">
							<div className="w-full">
								<h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
									Insertar Banner Publicitario
								</h3>

								<div className="space-y-4">
									{/* Slot selector */}
									<div>
										<label
											htmlFor="slot"
											className="block text-sm font-medium text-gray-700"
										>
											Slot de Anuncio
										</label>
										<select
											id="slot"
											value={selectedSlot}
											onChange={(e) =>
												setSelectedSlot(e.target.value)
											}
											className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
										>
											<option value="">
												Slot predeterminado
											</option>
											{commonSlots.map((slot) => (
												<option
													key={slot.value}
													value={slot.value}
												>
													{slot.label} ({slot.value})
												</option>
											))}
										</select>
									</div>

									{/* Format selector */}
									<div>
										<label
											htmlFor="format"
											className="block text-sm font-medium text-gray-700"
										>
											Formato
										</label>
										<select
											id="format"
											value={selectedFormat}
											onChange={(e) =>
												setSelectedFormat(
													e.target.value
												)
											}
											className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
										>
											{formatOptions.map((format) => (
												<option
													key={format.value}
													value={format.value}
												>
													{format.label}
												</option>
											))}
										</select>
									</div>

									{/* Responsive checkbox */}
									<div className="flex items-center">
										<input
											id="responsive"
											type="checkbox"
											checked={isResponsive}
											onChange={(e) =>
												setIsResponsive(
													e.target.checked
												)
											}
											className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
										/>
										<label
											htmlFor="responsive"
											className="ml-2 block text-sm text-gray-900"
										>
											Banner responsivo
										</label>
									</div>

									{/* Custom style input */}
									<div>
										<label
											htmlFor="customStyle"
											className="block text-sm font-medium text-gray-700"
										>
											Clases CSS personalizadas (opcional)
										</label>
										<input
											id="customStyle"
											type="text"
											value={customStyle}
											onChange={(e) =>
												setCustomStyle(e.target.value)
											}
											placeholder="ej: max-width-md, text-center"
											className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
										/>
									</div>

									{/* Preview */}
									<div className="bg-gray-50 p-3 rounded-md">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Vista previa del atajo:
										</label>
										<code className="bg-white px-2 py-1 rounded text-sm border">
											{generateShortcode()}
										</code>
									</div>
								</div>

								{/* Examples section */}
								<div className="mt-6">
									<h4 className="text-sm font-medium text-gray-900 mb-3">
										Ejemplos de uso:
									</h4>
									<div className="space-y-2">
										{examples.map((example, index) => (
											<div
												key={index}
												className="bg-gray-50 p-3 rounded-md"
											>
												<code className="text-sm text-gray-800 block mb-1">
													{example.code}
												</code>
												<p className="text-xs text-gray-600">
													{example.description}
												</p>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
						<button
							type="button"
							onClick={handleInsert}
							className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
						>
							Insertar Atajo
						</button>
						<button
							type="button"
							onClick={() => setIsOpen(false)}
							className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
						>
							Cancelar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdBannerShortcodeHelper;
