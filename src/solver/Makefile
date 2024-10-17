default: install build

install:
	python3 -m venv venv
	. ./venv/bin/activate
	pip install -r requirements.txt
	git clone https://github.com/emscripten-core/emsdk.git
build:
	. ./venv/bin/activate && \
	PYODIDE_EMSCRIPTEN_VERSION=$$(pyodide config get emscripten_version) && \
	./emsdk/emsdk install $${PYODIDE_EMSCRIPTEN_VERSION} && \
	./emsdk/emsdk activate $${PYODIDE_EMSCRIPTEN_VERSION} && \
	. ./emsdk/emsdk_env.sh && \
	pyodide build