package compiler_new

import cognitro.parsers.GraphUtils.{AstPrimitiveNode, AstType, BaseNode, ChildNode}
import compiler_new.errors.ErrorAccumulator
import compiler_new.stages.MatchType
import sdk.descriptions.Finders.FinderPath
import sdk.descriptions.{Component, Lens, Rule, Snippet}
import sourcegear.Gear
import sourcegear.gears.parsing.ParseGear

import scalax.collection.edge.LkDiEdge
import scalax.collection.mutable.Graph

sealed trait Output

case class ValidationStageOutput(isValid: Boolean,
                                 missingPaths: Set[String],
                                 extraPaths: Set[String])

case class SnippetStageOutput(astGraph: Graph[BaseNode, LkDiEdge],
                              rootNode: AstPrimitiveNode,
                              snippet: Snippet,
                              enterOn: Set[AstType],
                              entryChildren: Vector[AstPrimitiveNode],
                              matchType: MatchType.Value)


case class FinderStageOutput(componentFinders: Map[FinderPath, Vector[Component]],
                             ruleFinders: Map[FinderPath, Vector[Rule]])


//Source Gear factory output

case class ParserFactoryOutput(parseGear: ParseGear)



sealed trait FinalOutput extends Output {
  val isSuccess = false
  val isFailure = false
  def printErrors = {}
}
case class Success(gear: Gear) extends FinalOutput
case class Failure(lens: Lens, errorAccumulator: ErrorAccumulator) extends FinalOutput {
  override def printErrors = errorAccumulator.printAll
}