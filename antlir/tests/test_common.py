#!/usr/bin/env python3
# Copyright (c) Facebook, Inc. and its affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

import asyncio
import logging
import time
import unittest
import unittest.mock

from ..common import (
    async_retry_fn,
    async_retryable,
    kernel_version,
    log as common_log,
    retry_fn,
    retryable,
)


class TestCommon(unittest.TestCase):
    def test_retry_fn(self):
        class Retriable:
            def __init__(self, attempts_to_fail=0):
                self.attempts = 0
                self.first_success_attempt = attempts_to_fail + 1

            def run(self):
                self.attempts += 1
                if self.attempts >= self.first_success_attempt:
                    return self.attempts
                raise RuntimeError(self.attempts)

        self.assertEqual(
            1, retry_fn(Retriable().run, delays=[], what="succeeds immediately")
        )

        # Check log messages, and ensure that delays add up as expected
        start_time = time.time()
        with self.assertLogs(common_log) as log_ctx:
            self.assertEqual(
                4,
                retry_fn(
                    Retriable(3).run,
                    delays=[0, 0.1, 0.2],
                    what="succeeds on try 4",
                ),
            )
        self.assertTrue(
            any(
                "\n[Retry 3 of 3] succeeds on try 4 -- waiting 0.2 seconds.\n"
                in o
                for o in log_ctx.output
            )
        )
        self.assertGreater(time.time() - start_time, 0.3)

        # Check log to debug
        with self.assertLogs(common_log, level=logging.DEBUG) as log_ctx:
            self.assertEqual(
                4,
                retry_fn(
                    Retriable(3).run,
                    delays=[0, 0.1, 0.2],
                    what="succeeds on try 4",
                    log_exception=False,
                ),
            )
        self.assertTrue(
            any(
                "\n[Retry 3 of 3] succeeds on try 4 -- waiting 0.2 seconds.\n"
                in o
                for o in log_ctx.output
            )
        )

        # Check running out of retries
        with self.assertLogs(common_log) as log_ctx, self.assertRaises(
            RuntimeError
        ) as ex_ctx:
            retry_fn(Retriable(100).run, delays=[0] * 7, what="never succeeds")
        self.assertTrue(
            any(
                "\n[Retry 7 of 7] never succeeds -- waiting 0 seconds.\n" in o
                for o in log_ctx.output
            )
        )
        self.assertEqual((8,), ex_ctx.exception.args)

        # Test is_exception_retriable
        def _is_retryable(e):
            if isinstance(e, RuntimeError):
                return False
            return True

        with self.assertRaises(RuntimeError) as ex_ctx:
            retry_fn(
                Retriable(10).run,
                _is_retryable,
                delays=[0] * 5,
                what="never retries",
            )
        self.assertEqual((1,), ex_ctx.exception.args)

    def test_retryable(self):
        @retryable("got {a}, {b}, {c}", [0])
        def to_be_retried(a: int, b: int, c: int = 5):
            raise RuntimeError("retrying...")

        with self.assertRaises(RuntimeError), self.assertLogs(
            common_log
        ) as logs:
            to_be_retried(1, b=2)
        self.assertIn("got 1, 2, 5", "".join(logs.output))

    def test_async_retry_fn(self):
        class Retriable:
            def __init__(self, attempts_to_fail=0):
                self.attempts = 0
                self.first_success_attempt = attempts_to_fail + 1

            async def run(self):
                self.attempts += 1
                if self.attempts >= self.first_success_attempt:
                    return self.attempts
                raise RuntimeError(self.attempts)

        # In order to test our asynchronous decorator functionality, we
        # get the event loop of our test and schedule+run corountines
        # till completion. We cannot simply await since you can only
        # await inside an async function. Making the outer test async seems
        # to properly run the test, but fails to evaluate coverage.
        loop = asyncio.get_event_loop()

        self.assertEqual(
            1,
            loop.run_until_complete(
                async_retry_fn(
                    Retriable().run, delays=[], what="succeeds immediately"
                )
            ),
        )

        # Check log messages, and ensure that delays add up as expected
        start_time = time.time()
        with self.assertLogs(common_log) as log_ctx:
            self.assertEqual(
                4,
                loop.run_until_complete(
                    async_retry_fn(
                        Retriable(3).run,
                        delays=[0, 0.1, 0.2],
                        what="succeeds on try 4",
                    )
                ),
            )
        self.assertTrue(
            any(
                "\n[Retry 3 of 3] succeeds on try 4 -- waiting 0.2 seconds.\n"
                in o
                for o in log_ctx.output
            )
        )
        self.assertGreater(time.time() - start_time, 0.3)

        # Check log to debug
        with self.assertLogs(common_log, level=logging.DEBUG) as log_ctx:
            self.assertEqual(
                4,
                loop.run_until_complete(
                    async_retry_fn(
                        Retriable(3).run,
                        delays=[0, 0.1, 0.2],
                        what="succeeds on try 4",
                        log_exception=False,
                    )
                ),
            )
        self.assertTrue(
            any(
                "\n[Retry 3 of 3] succeeds on try 4 -- waiting 0.2 seconds.\n"
                in o
                for o in log_ctx.output
            )
        )

        # Check running out of retries
        with self.assertLogs(common_log) as log_ctx, self.assertRaises(
            RuntimeError
        ) as ex_ctx:
            loop.run_until_complete(
                async_retry_fn(
                    Retriable(100).run, delays=[0] * 7, what="never succeeds"
                )
            )
        self.assertTrue(
            any(
                "\n[Retry 7 of 7] never succeeds -- waiting 0 seconds.\n" in o
                for o in log_ctx.output
            )
        )
        self.assertEqual((8,), ex_ctx.exception.args)

        # Test is_exception_retriable
        def _is_retryable(e):
            if isinstance(e, RuntimeError):
                return False
            return True

        with self.assertRaises(RuntimeError) as ex_ctx:
            loop.run_until_complete(
                async_retry_fn(
                    Retriable(10).run,
                    _is_retryable,
                    delays=[0] * 5,
                    what="never retries",
                )
            )
        self.assertEqual((1,), ex_ctx.exception.args)

    def test_async_retryable(self):
        @async_retryable("got {a}, {b}, {c}", [0])
        async def to_be_retried(a: int, b: int, c: int = 5):
            raise RuntimeError("retrying...")

        with self.assertRaises(RuntimeError), self.assertLogs(
            common_log
        ) as logs:
            loop = asyncio.get_event_loop()
            loop.run_until_complete(to_be_retried(1, b=2))
        self.assertIn("got 1, 2, 5", "".join(logs.output))

    def test_retryable_skip(self):
        iters = 0

        @retryable(
            "got {a}, {b}, {c}",
            [0, 0, 0],
            is_exception_retryable=lambda _: False,
        )
        def to_be_retried(a: int, b: int, c: int = 5):
            nonlocal iters
            iters += 1
            raise RuntimeError("retrying...")

        with self.assertRaises(RuntimeError):
            to_be_retried(1, b=2)
        self.assertEqual(1, iters)

    @unittest.mock.patch("antlir.common._mockable_platform_release")
    def test_kernel_version(self, platform_release):
        uname_to_tuples = {
            "5.2.9-129_fbk13_hardened_3948_ga3d2430737fa": (5, 2),
            "5.11.4-arch1-1": (5, 11),
            "4.16.9-old-busted": (4, 16),
        }

        for uname, parsed in uname_to_tuples.items():
            platform_release.return_value = uname

            self.assertEqual(kernel_version(), parsed)
