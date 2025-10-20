package com.centralino.domain

sealed class AppResult<out T> {
    data class Ok<T>(val value: T): AppResult<T>()
    data class Err(val error: Throwable): AppResult<Nothing>()
}
