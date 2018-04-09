package com.opticdev.core.sourcegear.context

import com.opticdev.core.Fixture.TestBase
import com.opticdev.core.sourcegear.{CompiledLens, SGConfig, SGConstructor, SourceGear}
import com.opticdev.opm.providers.ProjectKnowledgeSearchPaths
import com.opticdev.opm.{PackageManager, TestPackageProviders}
import com.opticdev.sdk.descriptions.Schema
import org.scalatest.FunSpec

import scala.concurrent.duration._
import scala.concurrent.Await

class FlatContextSpec extends TestBase with TestPackageProviders {

  implicit val projectKnowledgeSearchPaths: ProjectKnowledgeSearchPaths = ProjectKnowledgeSearchPaths()
  lazy val dt = PackageManager.collectPackages(Seq(t.opticExpress.packageRef, t.a.packageRef)).get
  implicit lazy val config: SGConfig = Await.result(SGConstructor.fromDependencies(dt, Set()), 10 seconds)
  it("can construct flat context from dependency tree") {
    val flatContext = FlatContext.fromDependencyTree(dt)

    assert(flatContext.mapping.size == 2)
    assert(flatContext.mapping("optic:express-js").asInstanceOf[FlatContext].mapping.keys == Set("route", "parameter", "optic:rest"))

  }

  it("can lookup paths in flat context") {
    val flatContext = FlatContext.fromDependencyTree(dt)
    val expressJS = flatContext.resolve("optic:express-js").get.asInstanceOf[FlatContext]

    assert(expressJS.resolve("route").get.isInstanceOf[CompiledLens])
    assert(expressJS.resolve("/route").get.isInstanceOf[CompiledLens])
    assert(expressJS.resolve("optic:rest/route").get.isInstanceOf[Schema])
  }

  it("will not find non-existant paths") {
    val flatContext = FlatContext.fromDependencyTree(dt)

    assert(flatContext.resolve("not:real/one").isEmpty)
    assert(flatContext.resolve("not:real").isEmpty)
    assert(flatContext.resolve("").isEmpty)
  }
}
