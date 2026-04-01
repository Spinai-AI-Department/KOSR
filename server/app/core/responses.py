from __future__ import annotations

import json
from datetime import date, datetime
from decimal import Decimal
from typing import Any
from uuid import UUID

from starlette.responses import JSONResponse as _JSONResponse


class _Encoder(json.JSONEncoder):
    def default(self, o: Any) -> Any:
        if isinstance(o, UUID):
            return str(o)
        if isinstance(o, (datetime, date)):
            return o.isoformat()
        if isinstance(o, Decimal):
            return float(o)
        return super().default(o)


class AppJSONResponse(_JSONResponse):
    def render(self, content: Any) -> bytes:
        return json.dumps(
            content,
            cls=_Encoder,
            ensure_ascii=False,
            separators=(",", ":"),
        ).encode("utf-8")


def success(message: str, data: Any = None, status_code: int = 200) -> AppJSONResponse:
    return AppJSONResponse(
        status_code=status_code,
        content={
            "status": "success",
            "message": message,
            "data": data,
        },
    )



def error(message: str, error_code: str, data: Any = None, status_code: int = 400) -> AppJSONResponse:
    return AppJSONResponse(
        status_code=status_code,
        content={
            "status": "error",
            "error_code": error_code,
            "message": message,
            "data": data,
        },
    )
