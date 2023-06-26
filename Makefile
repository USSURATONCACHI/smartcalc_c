RAYLIB_BASE=raylib-4.5.0
CC=gcc -Wall -Wextra -Wpedantic -O3

INCLUDES_SRC=-isystem raylib/include -isystem include
INCLUDES=${INCLUDES_SRC}

LIBS_SRC=-Lraylib/lib 
LIBS=raylib/lib/libraylib.a

# OS - dependent

# win64_mingw-w64, win32_mingw-w64, linux_amd64, linux_i386, macos
RAYLIB_VERSION=
RMRF=
RENAME_FOLDER=mv
EXEC_EXT=
WARNS=

# Determining target OS 
ifeq ($(OS),Windows_NT)
	RMRF=sane_rm.exe
	EXEC_EXT=.exe
	RENAME_FOLDER=ren
	CC+=-D WIN32 -mwindows
	LIBS+=-lgdi32 -lwinmm

    ifeq ($(PROCESSOR_ARCHITEW6432),AMD64)
        RAYLIB_VERSION=win64_mingw-w64
		CC+=-D AMD64
    else
        ifeq ($(PROCESSOR_ARCHITECTURE),AMD64)
        	RAYLIB_VERSION=win64_mingw-w64
			CC+=-D AMD64
        endif
        ifeq ($(PROCESSOR_ARCHITECTURE),x86)
        	RAYLIB_VERSION=win32_mingw-w64
			RMRF=sane_rm32.exe 
			CC+=-D IA32
        endif
    endif
else
# 	TODO: Libraries for linux
	LIBS+=
	RMRF=rm -rf
    UNAME_S := $(shell uname -s)
    UNAME_P := $(shell uname -p)
    ifeq ($(UNAME_S),Linux)
        CC += -D LINUX

		ifeq ($(UNAME_P),x86_64)
        	RAYLIB_VERSION=linux_amd64
		endif
		ifneq ($(filter %86,$(UNAME_P)),)
        	RAYLIB_VERSION=linux_i386
		endif
		ifneq ($(filter arm%,$(UNAME_P)),)
			WARNS+=WARNING: We do not have raylib build for Linux ARM architecture. Going from there with AMD64 build, idk.
        	RAYLIB_VERSION=linux_amd64
		endif
    endif
    ifeq ($(UNAME_S),Darwin)
        CC += -D OSX
		LIBS+=-lobjc -framework Cocoa -framework IOKit
        RAYLIB_VERSION=macos
    endif

	ifeq ($(UNAME_P),x86_64)
		CC+=-D AMD64
	endif
	ifneq ($(filter %86,$(UNAME_P)),)
		CC+=-D IA32
	endif
	ifneq ($(filter arm%,$(UNAME_P)),)
		CC+=-D ARM
	endif
endif

TARGET_FILE=smartcalc${EXEC_EXT}

# install, uninstall, clean, dvi, dist, test, gcov_report
all: run

run: ${TARGET_FILE}
	./${TARGET_FILE}

build: ${TARGET_FILE}

${TARGET_FILE}: main.o raylib.cache
	${CC} main.o ${LIBS_SRC} ${LIBS} -o ${TARGET_FILE}

# This file indicates raylib build unpacked
raylib.cache:
	echo -nvm-${WARNS}
	tar -xzf raylib-builds/${RAYLIB_BASE}_${RAYLIB_VERSION}.tar.gz
	${RENAME_FOLDER} ${RAYLIB_BASE}_${RAYLIB_VERSION} raylib
	echo 1 > raylib.cache

# This thing just builds any .o file
%.o: %.c | raylib.cache
	${CC} -c $^ ${INCLUDES} -o $@

clean_lite:
	${RMRF} *.o
	${RMRF} */*.o
	${RMRF} */*/*.o
	${RMRF} ${TARGET_FILE}

clean: clean_lite
	${RMRF}	raylib.cache
	${RMRF}	raylib